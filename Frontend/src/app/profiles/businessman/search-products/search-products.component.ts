import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  DataFarmers,
  DataSearhProduct,
  IsSelects,
  RequestDataSearchProduts,
} from '../interfaces';
import { selectBusinessProfile } from 'src/app/store/selectors/global.selector';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  CoffeeVariety,
  States,
} from 'src/app/register/register-farmer/interface';
import { Subscription } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { GlobalButtonsComponent } from 'src/app/shared/global-buttons/global-buttons.component';
import {
  setCleanFilter,
  setOnChangeDataProducts,
  setOnChangePrices,
  setResponseSearchProducts,
  setShowModalSearchProducts,
} from 'src/app/store/actions/user-menu-businessman.actions';
import { BodyBusinessmanService } from '../body-businessman/services/body-businessman.service';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    IonicModule,
    FormsModule,
    TitleCasePipe,
    MatSliderModule,
    GlobalButtonsComponent,
  ],
})
export class SearchProductsComponent implements OnInit, OnDestroy {
  isSelects: IsSelects = {
    isFarmers: false,
    isVarietyCoffee: false,
    isOriginCoffee: false,
  };
  farmersData: (DataFarmers & { isSelected: boolean })[] = [];
  dataCoffeeVariety: (CoffeeVariety & { isSelected: boolean })[] = [];
  dataStates: (States & { isSelected: boolean })[] = [];

  dataSearchProduct: DataSearhProduct;

  coffeePriceRange = {
    min: NaN,
    max: NaN,
  };

  minPrice: number;
  maxPrice: number;

  isModalFilter: boolean;

  suscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private bbservice: BodyBusinessmanService
  ) {}

  ngOnInit() {
    if (!this.dataSearchProduct) {
      this.store.select(selectBusinessProfile).subscribe((data) => {
        this.isModalFilter = data.showModalSearchPrice;
        if (data.dataSearchProduct) {
          // Coffee variety
          this.dataCoffeeVariety = data.dataCoffeeVariety;

          // States
          this.dataStates = data.dataStates;

          // Price Range
          this.coffeePriceRange.min = data.rangePrice?.min!;
          this.coffeePriceRange.max = data.rangePrice?.max!;

          this.minPrice = data.minPrice;
          this.maxPrice = data.maxPrice + 1000;
        }
      });
    }
  }

  handleClickChecvron(id: number) {
    if (id === 1) {
      this.isSelects = {
        ...this.isSelects,
        isFarmers: !this.isSelects.isFarmers,
      };
    } else if (id === 2) {
      this.isSelects = {
        ...this.isSelects,
        isVarietyCoffee: !this.isSelects.isVarietyCoffee,
      };
    } else {
      this.isSelects = {
        ...this.isSelects,
        isOriginCoffee: !this.isSelects.isOriginCoffee,
      };
    }
  }

  handleOnChange(event: any, item: any, id: number) {
    event.preventDefault();
    if (id === 1) {
      this.farmersData = this.farmersData.map((farmer) => {
        if (farmer.id_user === item.id_user) {
          return { ...farmer, isSelected: !farmer.isSelected };
        }
        return farmer;
      });
    } else if (id === 2) {
      this.store.dispatch(setOnChangeDataProducts({ id: 2, item }));
    } else if (id === 3) {
      this.store.dispatch(setOnChangeDataProducts({ id: 3, item }));
    }
    this.handleSubmit();
  }

  handleOnChangePrice(event: any, id: number) {
    this.store.dispatch(setOnChangePrices({ id, value: event.target.value }));
    this.handleSubmit();
  }

  handleResetClose(id: number) {
    this.store.dispatch(setCleanFilter());
    if (id === 1) {
      this.handleSubmit();
    } else if (id === 2) {
      this.store.dispatch(setShowModalSearchProducts({ value: false }));
      this.store.dispatch(setResponseSearchProducts({ data: undefined }));
      this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
    }
    
  }

  handleSubmit() {
    // const selectedFarmers = this.farmersData.filter(
    //   (farmer) => farmer.isSelected
    // );

    const selecteCoffeeVarietyId: number[] = [];
    this.dataCoffeeVariety.filter((item) => {
      if (item.isSelected) {
        selecteCoffeeVarietyId.push(parseInt(item.id_variety.toString()));
      }
    });

    const selecteStatesId: number[] = [];
    this.dataStates.filter((item) => {
      if (item.isSelected) {
        selecteStatesId.push(parseInt(item.id_state.toString()));
      }
    });

    const body: RequestDataSearchProduts = {
      lot_properties: {
        id_variety:
          selecteCoffeeVarietyId.length > 0 ? selecteCoffeeVarietyId : null,
        id_profile: null,
        id_roast: null,
      },
      id_state: selecteStatesId.length > 0 ? selecteStatesId : null,
      price_range: {
        min_price: parseInt(this.coffeePriceRange.min.toString()),
        max_price: parseInt(this.coffeePriceRange.max.toString()),
      },
    };

    // console.log({ event });
    // event.preventDefault();

    this.bbservice.setSearchProduct(body).subscribe((res) => {
      if (!res) {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Error al cargar información, intentelo más tarde',
          })
        );
        return;
      }

      this.store.dispatch(setChangeActualIdDasboard({ actualId: 14 }));
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
