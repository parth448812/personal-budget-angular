import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { Pie } from 'd3-shape';
import { DataService } from '../data.service';
import { Data } from '@angular/router';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit{

  @ViewChild('dChart', { static: true }) public dChart!: ElementRef;


  public dataSource = {
    labels: [] as string[],
    datasets: [
        {
        data: [] as number[],
        backgroundColor: [
          '#8EA604',
          '#9AC2C9',
          '#FF6F59',
          '#1B4079',
          '#6D5A72',
          '#3E5641',
          '#FBB13C'
    ],
        hoverOffset: 4
    }]
  };

  constructor(private http: HttpClient, private DataService: DataService){

  }
  ngOnInit(): void {
    this.DataService.fetchData().subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
    }
      this.createChart();
      this.createD3();
    });
  }
  createChart() {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      width: 400,
      height: 400
    }
    var canvas = document.getElementById("myChart") as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
        options: options
    });
    }
  }

  createD3() {

      const width = 450;
      const height = 300;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(this.dChart.nativeElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      const dataForD3 = this.dataSource.labels.map((label, i) => ({
        label: label,
        value: this.dataSource.datasets[0].data[i],
      }));

      const color = d3.scaleOrdinal()
        .domain(dataForD3.map(d => d.label))
        .range(this.dataSource.datasets[0].backgroundColor);

      const pie = d3.pie<any>().value((d: any) => d.value);
      const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      const arcs = g.selectAll('arc')
        .data(pie(dataForD3))
        .enter()
        .append('g')
        .attr('class', 'arc');

        arcs.append('path')
        .attr('d', (d: any) => arcGenerator(d) as string)
        .attr('fill', (d: d3.PieArcDatum<string>) => color(d.data) as string);



      arcs.append('text')
        .attr('transform', (d: any) => `translate(${arcGenerator.centroid(d)})`)
        .attr('dy', '0.35em')
        .text((d: any) => d.data.label);
    }
    };
