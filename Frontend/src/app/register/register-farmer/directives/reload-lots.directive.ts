import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
    selector: '[appReloadLots]',
    standalone: true,
})
export class ReloadLotsDirective implements OnChanges {
  @Input() appReloadLots: number;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    this.viewContainerRef.createEmbeddedView(templateRef);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['appReloadLots'] &&
      changes['appReloadLots'].previousValue !== undefined
    ) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
