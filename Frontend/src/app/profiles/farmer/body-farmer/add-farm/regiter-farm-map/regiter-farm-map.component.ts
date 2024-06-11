import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { GlobalRegisterService } from 'src/app/register/services/register.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { setChangeActualIdDasboard } from 'src/app/store/actions/user-menu.actions';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Form1Service } from 'src/app/register/register-farmer/services/form1.service';
import {
  Cities,
  DataModalCllimate,
  FormRegisterFarm,
  InitialFormValuesFormRegisterFarmerb,
  ReponseDataCoordinates,
  RequeestCoordinates,
  RequestLonLat,
  States,
  Villages,
} from 'src/app/register/register-farmer/interface';
import { ErrorsFormsComponent } from 'src/app/shared/errors-forms/errors-forms.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { BodyFarmerService } from '../../../services/body-farmer.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalWithoutVillageComponent } from 'src/app/register/register-farmer/form-map-farmer/modal-without-village/modal-without-village.component';
import { ModalClimateInformationComponent } from 'src/app/register/register-farmer/form-map-farmer/modal-climate-information/modal-climate-information.component';
import { ModalAddVillageComponent } from 'src/app/register/register-farmer/form-map-farmer/modal-add-village/modal-add-village.component';
import { setIsLoading } from 'src/app/store/actions/loading.actions';
import { selectDataUser } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-regiter-farm-map',
  templateUrl: './regiter-farm-map.component.html',
  styleUrls: [
    '../../../../../register/register-farmer/form-map-farmer/form-map-farmer.component.css',
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    ErrorsFormsComponent,
    NgFor,
    MatTooltipModule,
    NgClass,
    MatDialogModule,
  ],
})
export class RegiterFarmMapComponent implements OnInit {
  longitude: number = NaN;
  latitude: number = NaN;

  states: States[] = [];
  cities: Cities[] = [];
  villages: Villages[] = [];
  coordinates?: ReponseDataCoordinates = undefined;

  isErrorRegisterFarm: boolean = false;
  isModalInformation: boolean = true;
  newNameVillage: string = '';

  dataRefForm: InitialFormValuesFormRegisterFarmerb = {
    city: '',
    heigth: '',
    nameFarm: '',
    numberLots: '',
    state: '',
    village: '',
    wather: '',
  };

  form1B: FormGroup = this.fb.group({
    nameFarm: [''],
    numberLots: [''],
    state: [''],
    city: [''],
    village: [''],
  });

  stateName?: string;
  cityName?: string;
  villageName?: string;

  private map!: L.Map;
  markers: L.Marker[] = [
    L.marker([13, -75]), // Amman
    L.marker([-4.5, -70]), // Irbid
  ];

  marker: L.Marker;

  typeIdentificaction: { id: number; name: string }[] = [
    { id: 1, name: 'Cédula de ciudadanía' },
    { id: 2, name: 'Cédula de extranjería' },
    { id: 3, name: 'Nit' },
  ];

  private mainSubscription: Subscription[] = [];
  private httpSubscription: Subscription[] = [];

  private subscriptionCoordinates: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private grservice: GlobalRegisterService,
    private f1service: Form1Service,
    private store: Store<AppState>,
    private bfservice: BodyFarmerService,
    private matDialog: MatDialog
  ) {
    this.handleInitStates();
  }

  ngOnInit() {
    const suscription = this.store.select(selectDataUser).subscribe((data) => {
      this.newNameVillage = data.newNameVillage;
    });

    this.mainSubscription.push(suscription);
  }

  handleInitStates() {
    const suscription1 = this.grservice.getStates('48').subscribe((index) => {
      this.states = index.states;
    });
    this.mainSubscription.push(suscription1);
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.setZoonInitial();
    this.centerMap();
    this.clikMap();

    if (!this.form1B.value.state) {
      this.form1B.get('state')?.setValue('');
      this.form1B.get('city')?.setValue('');
      this.form1B.get('village')?.setValue('');
    }
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private setZoonInitial() {
    // Add your markers to the map
    this.map.setView([4.5, -75], 1);
    // this.markers.forEach((marker) => marker.addTo(this.map));
  }

  private centerMap() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    // Create a LatLngBounds object to encompass all the marker locations

    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map view to the bounds
    this.map.fitBounds(bounds, {
      animate: true,
      duration: 1,
      padding: [-18, -20],
    });
  }

  private zoomMap(
    latmin: number,
    latmax: number,
    lonmin: number,
    lonmax: number
  ) {
    this.markers[0] = L.marker([latmin, lonmin]);
    this.markers[1] = L.marker([latmax, lonmax]);

    this.centerMap();
  }

  private clikMap() {
    this.map.on('click', (event) => {
      this.ngOnDestroyDataHTTP();

      this.cities = [];
      this.villages = [];
      this.coordinates = undefined;
      this.form1B.get('state')?.setValue(null);
      this.form1B.get('city')?.setValue(null);
      this.form1B.get('village')?.setValue(null);

      this.store.dispatch(setIsLoading({ value: true }));
      this.longitude = event.latlng.lng;
      this.latitude = event.latlng.lat;

      const lat = event.latlng.lat;
      const lon = event.latlng.lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lon]).addTo(this.map);

      const body: RequestLonLat = {
        latitude: lat,
        longitude: lon,
      };

      const suscription2 = this.grservice
        .getIdsByCoordinates(body)
        .subscribe((dataIds) => {
          this.form1B.get('state')?.setValue(dataIds.id_state);

          if (this.form1B.controls.state.value) {
            const suscriptionCitiesMap = this.grservice
              .getCities(dataIds.id_state.toString())
              .subscribe((dataCities) => {
                this.cities = dataCities;
              });

            this.httpSubscription.push(suscriptionCitiesMap);

            this.form1B.get('city')?.setValue(dataIds.id_city);
          }

          const suscriptionVillage = this.grservice
            .getVillage(dataIds.id_city.toString())
            .subscribe((dataVillages) => {
              this.villages = dataVillages;

              const res = this.villages.find(
                (village) => village.village_name === 'NOMBRE DESCONOCIDO'
              );

              if (res && this.isModalInformation) {
                this.isModalInformation = false;
                this.matDialog.open(ModalWithoutVillageComponent);
              }
            });

          this.httpSubscription.push(suscriptionVillage);

          this.form1B.get('village')?.setValue(dataIds.id_village);

          this.handleGetCoordinates(null, null, dataIds.id_village);
        });
      this.httpSubscription.push(suscription2);
    });
  }

  ngOnDestroyDataHTTP() {
    this.httpSubscription.forEach((suscription) => suscription.unsubscribe());
  }

  onChangeState(e: any) {
    const state = e.target.value;
    const idState = parseInt(state);

    if (state !== this.dataRefForm.state) {
      this.handleGetCoordinates(idState, null, null);

      this.cities = [];
      this.villages = [];

      const suscription = this.grservice
        .getCities(state)
        .subscribe((dataCities) => {
          this.cities = dataCities;
        });

      this.httpSubscription.push(suscription);
    }
    this.dataRefForm.state = e.target.value;
  }

  onChangeCity(e: any) {
    const city = e.target.value;
    const idCity = parseInt(city);

    if (city !== this.dataRefForm.city) {
      this.villages = [];

      const suscription = this.grservice
        .getVillage(city)
        .subscribe((dataVillages) => {
          this.villages = dataVillages;
        });

      this.httpSubscription.push(suscription);

      this.handleGetCoordinates(null, idCity, null);
    }
    this.dataRefForm.city = e.target.value;
  }

  onChangeVillage(e: any) {
    const village = e.target.value;
    const idVillage = parseInt(village);

    if (village !== this.dataRefForm.village) {
      this.handleGetCoordinates(null, null, idVillage);

      const findIdUnKnow = this.villages.find(
        (item) => item.id_village === parseInt(village)
      );

      console.log({ findIdUnKnow });

      if (findIdUnKnow?.village_name === 'NOMBRE DESCONOCIDO') {
        this.matDialog.open(ModalAddVillageComponent, {
          data: this.dataRefForm.city,
        });
        return;
      }
    }
    this.dataRefForm.village = e.target.value;
  }

  handleGetCoordinates(
    isState: number | null,
    idCity: number | null,
    idVillage: number | null
  ) {
    this.subscriptionCoordinates.unsubscribe();
    const coordinates: RequeestCoordinates = {
      id_state: isState,
      id_city: idCity,
      id_village: idVillage,
    };

    this.subscriptionCoordinates = this.grservice
      .getCoordinatesByVillage(coordinates)
      .subscribe((data) => {
        this.coordinates = data;

        this.store.dispatch(setIsLoading({ value: false }));

        if (!data) return;

        // this.longitude = data.centroid.x;
        // this.latitude = data.centroid.y;

        const { ymin, ymax, xmin, xmax } = data.bbox;
        this.zoomMap(ymin, ymax, xmin, xmax);

        if (coordinates.id_village) {
          this.marker = L.marker([data.centroid.y, data.centroid.x]).addTo(
            this.map
          );
        }
      });
  }

  validatorFields(field: string) {
    return (
      this.form1B.controls[field].errors && this.form1B.controls[field].touched
    );
  }

  back() {
    this.store.dispatch(setChangeActualIdDasboard({ actualId: 1 }));
  }

  next() {
    if (this.form1B.invalid) {
      this.form1B.markAllAsTouched();
      return;
    }

    const body: FormRegisterFarm = {
      nameFarm: this.form1B.get('nameFarm')?.value,
      city: this.form1B.get('city')?.value,
      village: this.form1B.get('village')?.value,
      numberLots: this.form1B.get('numberLots')?.value,
      farmLatitude: this.coordinates ? this.coordinates?.centroid.y : NaN,
      farmLongitude: this.coordinates ? this.coordinates?.centroid.x : NaN,
      newNameVillage: this.newNameVillage,
    };

    const suscription6 = this.f1service.registerFarm(body).subscribe((res) => {
      if (!res) {
        this.isErrorRegisterFarm = true;
        return;
      }

      const stateName = this.states.find(
        (item) => item.id_state === parseInt(this.form1B.get('state')?.value)
      );

      const cityName = this.cities.find(
        (item) => item.id_city === parseInt(this.form1B.get('city')?.value)
      );

      const villageName = this.villages.find(
        (item) =>
          item.id_village === parseInt(this.form1B.get('village')?.value)
      );

      const dataModal: DataModalCllimate = {
        ...res,
        stateName: stateName ? stateName.state_name : '',
        cityName: cityName ? cityName.city_name : '',
        villageName: this.newNameVillage
          ? this.newNameVillage
          : villageName
          ? villageName.village_name
          : '',
        isRegister: false,
      };

      this.matDialog.open(ModalClimateInformationComponent, {
        data: dataModal,
      });

      this.bfservice.getDataProfileFarm();
    });

    this.httpSubscription.push(suscription6);
  }

  ngOnDestroy(): void {
    this.mainSubscription.forEach((suscription) => {
      suscription.unsubscribe();
    });

    this.ngOnDestroyDataHTTP();
  }
}
