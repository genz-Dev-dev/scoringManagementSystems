import { Component, Input, input } from "@angular/core";

@Component({
    selector: 'app-stats-card',
    template: `
      <div class="flex items-center gap-2 p-5 bg-white rounded-xl shadow-sm">
        <div class="p-2 rounded-lg {{secondary}}">
            <i class="{{icon}} {{primary}}"></i>
        </div>
        <div>
            <div class="text-2xl font-bold text-indigo-950">{{total}}</div>
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {{title}}
            </div>
        </div>
    </div>`
})
export class StatsCardComponent {

    @Input() icon: string;
    @Input() total: number;
    @Input() title: string;
    @Input() primary: string;
    @Input() secondary: string;

}
