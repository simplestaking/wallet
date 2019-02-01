import { Injectable } from "@angular/core";
import { OperationHistoryEntity } from "../tezos-operation/tezos-operation-history/tezos-operation-history.entity";
import { HistoricalPrice } from "../tezos-operation/tezos-operation-history/tezos-operation-history.reducer";
import { ChartDataPoint } from "../../shared/charts/chart-line-nav/chart-line-nav.component";

@Injectable({
    providedIn: 'root',
  })
export class TezosWalletChartService {
    
    static readonly HISTORY_SIZE = 100;

    constructor(){}

    preprareChartValues(
        entitiesArray: OperationHistoryEntity[],
        historicalPrice: HistoricalPrice,
        lastBalance: number
    ) {

        const dailyBalanceChange = this.sumForPeriod(entitiesArray);
        const chartValues = this.composeChartValues(historicalPrice, dailyBalanceChange, lastBalance);

        return chartValues;
    }

    sumForPeriod(entities: OperationHistoryEntity[]) {

        // save last value to agregation
        const balanceChangeForPeriod: Record<number, number> = {};

        // sum transaction per day 
        entities
            .filter(operation => operation.timestamp)
            .map((entry) => {
                let periodChange = balanceChangeForPeriod[entry.dateUnixTimeStamp] || 0;


                // sum ammount for every transaction period 
                periodChange += entry.failed ? 0 : entry.amount;
                // add fees to calculation
                periodChange -= entry.type === 'credit' ? 0 : entry.fee;
                // burn operation cost
                periodChange -= entry.failed ? 0 : entry.burn;

                balanceChangeForPeriod[entry.dateUnixTimeStamp] = periodChange;

            })

        return balanceChangeForPeriod;
    }

    composeChartValues(
        historicalPrice: HistoricalPrice,
        balanceChangeForPeriod: Record<number, number>,
        lastBalance: number
    ) {

        let balance = lastBalance;
        const chartValues: ChartDataPoint[] = [];

        // iterate over historical periods and find corresponding changes
        historicalPrice.ids.slice(-TezosWalletChartService.HISTORY_SIZE).map(id => id).reverse().map(id => {

            const entry = historicalPrice.entities[id];
            const entryTime = entry.time;
            const periodChange = balanceChangeForPeriod[entryTime] || 0;

            balance -= periodChange;

            // @TODO remove when TzScan fix issue with ignoring burn on transaction to inactive wallet
            // prevent negative values which might occure due to issue
            const balanceTz = Math.max(0, balance / 1000000);

            chartValues.push({
                name: new Date(entryTime * 1000),
                balance: balanceTz,
                value: balanceTz * entry.close
            });
        });

        return chartValues;
    }

    buildChart(balance: number, price: number, values: ChartDataPoint[]) {

        // push at least some value to chart so it does not fail        
        const lastBalanceTz = balance / 1000000;
        let finalValues = values;

        // in case of no operation
        // add first and last point so we get a line with current balance  
        if (finalValues.length === 0) {

            finalValues = [
                {
                    name: new Date(Date.now() - 3600 * 1000 * 24 * TezosWalletChartService.HISTORY_SIZE),
                    balance: lastBalanceTz,
                    value: lastBalanceTz * price
                },
                {
                    name: new Date(),
                    balance: lastBalanceTz,
                    value: lastBalanceTz * price
                }
            ];

        } else {

            // save last price point in chart
            if (balance && price) {
                const netValue = finalValues[0];
                const balanceTz = balance / 1000000;

                netValue.balance = balanceTz;
                netValue.value = balanceTz * price;
            }
        }

        return [{
            name: 'xtz',
            series: finalValues
        }];
    }
}