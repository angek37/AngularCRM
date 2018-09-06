import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {CrmService} from '../../../../services/crm.service';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class OportunidadesChartComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  query = '$select=statecode';
  data = [
    {name: 'Abierta', value: 0},
    {name: 'Lograda', value: 0},
    {name: 'Perdida', value: 0},
  ];

  constructor(private theme: NbThemeService, private crm: CrmService) {
  }

  ngAfterViewInit() {
    this.crm.getEntities('opportunities', this.query)
      .subscribe(
        (resp: any) => {
          resp.value.forEach(
            (element) => {
              switch (element.statecode) {
                case 0:
                  this.data[0].value = this.data[0].value + 1;
                  break;
                case 1:
                  this.data[1].value = this.data[1].value + 1;
                  break;
                case 2:
                  this.data[2].value = this.data[2].value + 1;
                  break;
              }
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

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Lograda', 'Abierta', 'Perdida'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Oportunidades',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
