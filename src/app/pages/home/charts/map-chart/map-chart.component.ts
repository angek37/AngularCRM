import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NgxEchartsService } from 'ngx-echarts';
import { NbThemeService } from '@nebular/theme';
import {CrmService} from '../../../../services/crm.service';

@Component({
  selector: 'ngx-bubble-map',
  styleUrls: ['./map-chart.component.scss'],
  template: '<div echarts [loading]="loading" [options]="options" class="echarts"></div>',
})
export class MapChartComponent implements OnDestroy {

  latlong: any = {};
  mapData: any[];
  max = -Infinity;
  min = Infinity;
  options: any;
  loading = true;
  query = '$select=address1_stateorprovince' +
    '&$filter=address1_country eq \'Mexico\' or%20 address1_country eq \'mx\' or%20 address1_country eq \'México\'';

  bubbleTheme: any;
  geoColors: any[];
  statesInf: any[];

  private alive = true;

  constructor(private theme: NbThemeService,
              private http: HttpClient,
              private es: NgxEchartsService,
              private crm: CrmService) {
    this.theme.getJsTheme().subscribe(
      (config: any) => {
        const colors = config.variables;
        this.geoColors = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];
      }
    );
    this.crm.getEntities('accounts', this.query)
      .subscribe(
        (resp: any) => {
          this.groupByState(resp.value);
          this.mapData = this.statesInf;
          this.draw();
          this.loading = false;
        }
      );
  }

  groupByState(records: any[]) {
    this.statesInf = [];
    records.forEach(
      (record) => {
        const r: any = this.statesInf.find(state => state.code === record.address1_stateorprovince);
        if (r) {
          r.value++;
        } else {
          this.statesInf.push({
            'code': record.address1_stateorprovince,
            'name': this.getStateName(record.address1_stateorprovince),
            'value': 1,
            'color': this.getRandomGeoColor()
          });
        }
      }
    );
  }


  draw() {
    combineLatest([
      this.http.get('assets/map/mexico.json'),
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([map, config]: [any, any]) => {

        this.es.registerMap('world', map);

        this.bubbleTheme = config.variables.bubbleMap;

        this.latlong = {
          'MX': { 'latitude': 23, 'longitude': -102 },
          'AS': { 'latitude': 21.8852562, 'longitude': -102.29156769999997 },
          'BC': { 'latitude': 30.8406338, 'longitude': -115.28375849999998 },
          'BS': { 'latitude': 26.0444446, 'longitude': -111.66607249999998 },
          'CC': { 'latitude': 18.931225, 'longitude': -90.26180679999999 },
          'CS': { 'latitude': 16.7569318, 'longitude': -93.1292353 },
          'CH': { 'latitude': 28.6329957, 'longitude': -106.06910040000002 },
          'CL': { 'latitude': 27.058676, 'longitude': -101.7068294 },
          'CM': { 'latitude': 19.1222634, 'longitude': -104.00723479999999 },
          'DF': { 'latitude': 19.4326077, 'longitude': -99.13320799999997 },
          'DG': { 'latitude': 24.5592665, 'longitude': -104.6587821 },
          'GT': { 'latitude': 21.0190145, 'longitude': -101.25735859999998 },
          'GR': { 'latitude': 17.4391926, 'longitude': -99.54509739999997 },
          'HG': { 'latitude': 20.0910963, 'longitude': -98.76238739999997 },
          'JC': { 'latitude': 20.6595382, 'longitude': -103.34943759999999 },
          'MC': { 'latitude': 19.4968732, 'longitude': -99.72326729999997 },
          'MN': { 'latitude': 19.5665192, 'longitude': -101.7068294 },
          'MS': { 'latitude': 18.6813049, 'longitude': -99.10134979999998 },
          'NT': { 'latitude': 21.7513844, 'longitude': -104.84546190000003 },
          'NL': { 'latitude': 25.592172, 'longitude': -99.99619469999999 },
          'OC': { 'latitude': 17.0542297, 'longitude': -96.71323039999999 },
          'PL': { 'latitude': 19.0414398, 'longitude': -98.2062727 },
          'QO': { 'latitude': 20.5887932, 'longitude': -100.38988810000001 },
          'QR': { 'latitude': 19.1817393, 'longitude': -88.4791376 },
          'SP': { 'latitude': 22.1564699, 'longitude': -100.98554089999999 },
          'SL': { 'latitude': 25.1721091, 'longitude': -107.4795173 },
          'SR': { 'latitude': 29.2972247, 'longitude': -110.33088140000001 },
          'TC': { 'latitude': 17.8409173, 'longitude': -92.6189273 },
          'TS': { 'latitude': 24.26694, 'longitude': -98.8362755 },
          'TL': { 'latitude': 19.318154, 'longitude': -98.2374954 },
          'VZ': { 'latitude': 19.173773, 'longitude': -96.13422409999998 },
          'YN': { 'latitude': 20.7098786, 'longitude': -89.09433769999998 },
          'ZS': { 'latitude': 22.7708555, 'longitude': -102.5832426 }
        };

        // this.mapData = [
        //   { 'code': 'MX', 'name': 'Mexico', 'value': 10, 'color': this.getRandomGeoColor() },
        //   { 'code': 'GT', 'name': 'Guanajuato', 'value': 2, 'color': this.getRandomGeoColor() }
        // ];

        this.mapData.forEach((itemOpt) => {
          if (itemOpt.value > this.max) {
            this.max = itemOpt.value;
          }
          if (itemOpt.value < this.min) {
            this.min = itemOpt.value;
          }
        });

        this.options = {
          tooltip: {
            trigger: 'item',
            formatter: params => {
              return `${params.name}: ${params.value[2]}`;
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: this.max,
            inRange: {
              symbolSize: [6, 60],
            },
          },
          geo: {
            name: 'Cuentas',
            type: 'map',
            map: 'world',
            roam: true,
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                areaColor: this.bubbleTheme.areaColor,
                borderColor: this.bubbleTheme.areaBorderColor,
              },
              emphasis: {
                areaColor: this.bubbleTheme.areaHoverColor,
              },
            },
            zoom: 1.1,
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: this.mapData.map(itemOpt => {
                return {
                  name: itemOpt.name,
                  value: [
                    this.latlong[itemOpt.code].longitude,
                    this.latlong[itemOpt.code].latitude,
                    itemOpt.value,
                  ],
                  itemStyle: {
                    normal: {
                      color: itemOpt.color,
                    },
                  },
                };
              }),
            },
          ],
        };
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getRandomGeoColor() {
    const index = Math.round(Math.random() * this.geoColors.length);
    return this.geoColors[index];
  }

  private getStateName(cod: string) {
    const states = [
      { ab: 'AS', name: 'Aguascalientes'},
      { ab: 'BC', name: 'Baja California'},
      { ab: 'BS', name: 'Baja California Sur'},
      { ab: 'CC', name: 'Campeche'},
      { ab: 'CS', name: 'Chiapas'},
      { ab: 'CH', name: 'Chihuahua'},
      { ab: 'CL', name: 'Coahuila'},
      { ab: 'CM', name: 'Colima'},
      { ab: 'DF', name: 'Ciudad de México'},
      { ab: 'DG', name: 'Durango'},
      { ab: 'GT', name: 'Guanajuato'},
      { ab: 'GR', name: 'Guerrero'},
      { ab: 'HG', name: 'Hidalgo'},
      { ab: 'JC', name: 'Jalisco'},
      { ab: 'MC', name: 'México'},
      { ab: 'MN', name: 'Michoacán'},
      { ab: 'MS', name: 'Morelos'},
      { ab: 'NT', name: 'Nayarit'},
      { ab: 'NL', name: 'Nuevo León'},
      { ab: 'OC', name: 'Oaxaca'},
      { ab: 'PL', name: 'Puebla'},
      { ab: 'QO', name: 'Querétaro'},
      { ab: 'QR', name: 'Quintana Roo'},
      { ab: 'SP', name: 'San Luis Potosí'},
      { ab: 'SL', name: 'Sinaloa'},
      { ab: 'SR', name: 'Sonora'},
      { ab: 'TC', name: 'Tabasco'},
      { ab: 'TS', name: 'Tamaulipas'},
      { ab: 'TL', name: 'Tlaxcala'},
      { ab: 'VZ', name: 'Veracruz'},
      { ab: 'YN', name: 'Yucatán'},
      { ab: 'ZS', name: 'Zacatecas'}
    ];
    return states.find(state => state.ab === cod).name;
  }
}
