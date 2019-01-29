import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { MouseEvent } from '@swimlane/ngx-charts/release/events';
import { TooltipDirective, TooltipContentComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'g[ngx-charts-tooltip-area-nav]',
  template: `
    <svg:g>
      <svg:rect 
        class="tooltip-area" 
        [attr.x]="0" 
        y="0" 
        [attr.width]="dims.width" 
        [attr.height]="dims.height" 
        style="opacity: 0; cursor: 'auto';" 
        (mouseenter)="showTooltip()" 
        (mousemove)="mouseMove($event)"
        (mouseleave)="hideTooltip()"
      />
    	<xhtml:ng-template #defaultTooltipTemplate let-model="model">
    		<xhtml:div class="area-tooltip-container">
    			<xhtml:div *ngFor="let tooltipItem of model" class="tooltip-item">
    				<span class="tooltip-item-color" [style.background-color]="tooltipItem.color"></span>{{getToolTipText(tooltipItem)}}
    			</xhtml:div>
    		</xhtml:div>
    	</xhtml:ng-template>
      <svg:rect 
        #tooltipAnchor 
        [@animationState]="'active'"
        class="tooltip-anchor" 
        [attr.x]="anchorPos" 
        y="0" 
        [attr.width]="1" 
        [attr.height]="dims.height"
        [style.opacity]="anchorOpacity" 
        [style.pointer-events]="'none'"          
        ngx-tooltip 
        [tooltipDisabled]="tooltipDisabled" 
        [tooltipPlacement]="'top'" 
        [tooltipType]="'tooltip'" 
        [tooltipSpacing]="15" 
        [tooltipTemplate]="tooltipTemplate ? tooltipTemplate: defaultTooltipTemplate" 
        [tooltipContext]="anchorValues" 
        [tooltipImmediateExit]="true" 
        [tooltipShowCaret]="false" 
        [tooltipHideTimeout]=0 
        [tooltipShowTimeout]=0  
      />
    </svg:g>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      // transition('inactive => active', [
      //   style({
      //     opacity: 0,
      //   }),
      //   animate(250, style({opacity: 0.7}))
      // ]),
      // transition('active => inactive', [
      //   style({
      //     opacity: 0.7,
      //   }),
      //   animate(250, style({opacity: 0}))
      // ])
    ])
  ]
})
export class TooltipAreaNavComponent {
  anchorOpacity: number = 0;
  anchorPos: number = -1;
  anchorValues: any = {};
  lastAnchorPos: number;

  @Input() dims;
  @Input() xSet;
  @Input() xScale;
  @Input() yScale;
  @Input() results;
  @Input() colors;
  @Input() showPercentage: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() hover = new EventEmitter();

  @ViewChild('tooltipAnchor') tooltipAnchor;

  @ViewChild(TooltipDirective) ttp: TooltipDirective;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  getValues(xVal): any[] {
    const results = [];

    for (const group of this.results) {
      const item = group.series.find(d => d.name.toString() === xVal.toString());
      let groupName = group.name;
      if (groupName instanceof Date) {
        groupName = groupName.toLocaleDateString();
      }

      if (item) {
        const label = item.name;
        let val = item.value;
        if (this.showPercentage) {
          val = (item.d1 - item.d0).toFixed(2) + '%';
        }
        let color;
        if (this.colors.scaleType === 'linear') {
          let v = val;
          if (item.d1) {
            v = item.d1;
          }
          color = this.colors.getColor(v);
        } else {
          color = this.colors.getColor(group.name);
        }

        results.push({
          value: val,
          name: label,
          series: groupName,
          balance: item.balance,
          min: item.min,
          max: item.max,
          color
        });
      }

    }

    return results;
  }

  mouseMove(event) {
    const xPos = event.pageX - event.target.getBoundingClientRect().left;
    const closestIndex = this.findClosestPointIndex(xPos);
    const closestPoint = this.xSet[closestIndex];

    this.anchorPos = this.xScale(closestPoint);
    this.anchorPos = Math.max(0, this.anchorPos);
    this.anchorPos = Math.min(this.dims.width, this.anchorPos);

    this.anchorValues = this.getValues(closestPoint)[0];

    if (this.anchorPos !== this.lastAnchorPos) {
      const toolTipComponent = this.ttp['component'];

      // console.log('update')

      this.anchorOpacity = 0.7;
      this.hover.emit({
        value: closestPoint
      });

      if (toolTipComponent && toolTipComponent.instance && this.anchorValues) {
        const context = toolTipComponent.instance.context;

        if (context) {
          context.value = this.anchorValues.value;
          context.balance = this.anchorValues.balance;
          context.name = this.anchorValues.name;
        }

        toolTipComponent.instance.position();
        toolTipComponent.changeDetectorRef.markForCheck();
      }

      this.lastAnchorPos = this.anchorPos;
    }
  }

  findClosestPointIndex(xPos) {
    let minIndex = 0;
    let maxIndex = this.xSet.length - 1;
    let minDiff = Number.MAX_VALUE;
    let closestIndex = 0;

    while (minIndex <= maxIndex) {
      const currentIndex = (minIndex + maxIndex) / 2 | 0;
      const currentElement = this.xScale(this.xSet[currentIndex]);

      const curDiff = Math.abs(currentElement - xPos);

      if (curDiff < minDiff) {
        minDiff = curDiff;
        closestIndex = currentIndex;
      }

      if (currentElement < xPos) {
        minIndex = currentIndex + 1;
      } else if (currentElement > xPos) {
        maxIndex = currentIndex - 1;
      } else {
        minDiff = 0;
        closestIndex = currentIndex;
        break;
      }
    }

    return closestIndex;
  }

  showTooltip() {
    this.ttp.showTooltip(true);
  }

  hideTooltip() {
    this.ttp.hideTooltip(true);
    this.anchorOpacity = 0;
    this.lastAnchorPos = -1;
  }

  getToolTipText(tooltipItem: any): string {
    let result: string = '';
    if (tooltipItem.series !== undefined) {
      result += tooltipItem.series;
    } else {
      result += '???';
    }
    result += ': ';
    if (tooltipItem.value !== undefined) {
      result += tooltipItem.value.toLocaleString();
    }
    if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
      result += ' (';
      if (tooltipItem.min !== undefined) {
        if (tooltipItem.max === undefined) {
          result += '≥';
        }
        result += tooltipItem.min.toLocaleString();
        if (tooltipItem.max !== undefined) {
          result += ' - ';
        }
      } else if (tooltipItem.max !== undefined) {
        result += '≤';
      }
      if (tooltipItem.max !== undefined) {
        result += tooltipItem.max.toLocaleString();
      }
      result += ')';
    }
    return result;
  }

}
