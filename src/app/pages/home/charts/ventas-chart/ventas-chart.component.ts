import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {CrmService} from '../../../../services/crm.service';

@Component({
  selector: 'ngx-echarts-bar',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class VentasChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  data: any;
  query = '$select=actualvalue&$expand=owninguser($select=fullname)&$orderby=actualvalue desc&$top=7';
  columns = [];
  total = [];

  constructor(private theme: NbThemeService,
  private crm: CrmService) {
  }

  ngAfterViewInit() {
    this.crm.getEntities('opportunities', this.query)
      .subscribe(
        (resp: Response) => {
          this.data = resp;
          this.data.value.forEach(
            (element: any) => {
              this.columns.push(element.owninguser.fullname);
              this.total.push(element.actualvalue);
            }
          );
          this.draw();
        },
        (error) => {
          console.log('An error has been occur');
          this.draw();
        }
      );
  }

  draw() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.columns,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Total Amount',
            type: 'bar',
            barWidth: '60%',
            data: this.total,
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
