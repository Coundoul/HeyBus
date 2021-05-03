import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'agence',
        data: { pageTitle: 'heybusApp.agence.home.title' },
        loadChildren: () => import('./agence/agence.module').then(m => m.AgenceModule),
      },
      {
        path: 'transporteur',
        data: { pageTitle: 'heybusApp.transporteur.home.title' },
        loadChildren: () => import('./transporteur/transporteur.module').then(m => m.TransporteurModule),
      },
      {
        path: 'arret',
        data: { pageTitle: 'heybusApp.arret.home.title' },
        loadChildren: () => import('./arret/arret.module').then(m => m.ArretModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'heybusApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'depense',
        data: { pageTitle: 'heybusApp.depense.home.title' },
        loadChildren: () => import('./depense/depense.module').then(m => m.DepenseModule),
      },
      {
        path: 'employe',
        data: { pageTitle: 'heybusApp.employe.home.title' },
        loadChildren: () => import('./employe/employe.module').then(m => m.EmployeModule),
      },
      {
        path: 'fuel',
        data: { pageTitle: 'heybusApp.fuel.home.title' },
        loadChildren: () => import('./fuel/fuel.module').then(m => m.FuelModule),
      },
      {
        path: 'incident',
        data: { pageTitle: 'heybusApp.incident.home.title' },
        loadChildren: () => import('./incident/incident.module').then(m => m.IncidentModule),
      },
      {
        path: 'maintenance',
        data: { pageTitle: 'heybusApp.maintenance.home.title' },
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
      },
      {
        path: 'ville',
        data: { pageTitle: 'heybusApp.ville.home.title' },
        loadChildren: () => import('./ville/ville.module').then(m => m.VilleModule),
      },
      {
        path: 'pays',
        data: { pageTitle: 'heybusApp.pays.home.title' },
        loadChildren: () => import('./pays/pays.module').then(m => m.PaysModule),
      },
      {
        path: 'position',
        data: { pageTitle: 'heybusApp.position.home.title' },
        loadChildren: () => import('./position/position.module').then(m => m.PositionModule),
      },
      {
        path: 'revenu',
        data: { pageTitle: 'heybusApp.revenu.home.title' },
        loadChildren: () => import('./revenu/revenu.module').then(m => m.RevenuModule),
      },
      {
        path: 'section',
        data: { pageTitle: 'heybusApp.section.home.title' },
        loadChildren: () => import('./section/section.module').then(m => m.SectionModule),
      },
      {
        path: 'reservation',
        data: { pageTitle: 'heybusApp.reservation.home.title' },
        loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule),
      },
      {
        path: 'type-de-paiement',
        data: { pageTitle: 'heybusApp.typeDePaiement.home.title' },
        loadChildren: () => import('./type-de-paiement/type-de-paiement.module').then(m => m.TypeDePaiementModule),
      },
      {
        path: 'vehicule',
        data: { pageTitle: 'heybusApp.vehicule.home.title' },
        loadChildren: () => import('./vehicule/vehicule.module').then(m => m.VehiculeModule),
      },
      {
        path: 'voyage',
        data: { pageTitle: 'heybusApp.voyage.home.title' },
        loadChildren: () => import('./voyage/voyage.module').then(m => m.VoyageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
