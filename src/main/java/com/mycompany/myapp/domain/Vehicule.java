package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Vehicule.
 */
@Entity
@Table(name = "vehicule")
public class Vehicule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "reference", nullable = false, unique = true)
    private String reference;

    @Column(name = "num_chassis")
    private String numChassis;

    @Column(name = "num_carte_grise")
    private String numCarteGrise;

    @Column(name = "nbre_place")
    private Integer nbrePlace;

    @Column(name = "marque_voiture")
    private String marqueVoiture;

    @Column(name = "photo")
    private String photo;

    @Column(name = "refcartetotal")
    private String refcartetotal;

    @Column(name = "typemoteur")
    private String typemoteur;

    @OneToMany(mappedBy = "vehicule")
    @JsonIgnoreProperties(value = { "vehicule" }, allowSetters = true)
    private Set<Fuel> fuels = new HashSet<>();

    @OneToMany(mappedBy = "vehicule")
    @JsonIgnoreProperties(value = { "vehicule" }, allowSetters = true)
    private Set<Incident> incidents = new HashSet<>();

    @OneToMany(mappedBy = "vehicule")
    @JsonIgnoreProperties(value = { "vehicule" }, allowSetters = true)
    private Set<Maintenance> maintenances = new HashSet<>();

    @OneToMany(mappedBy = "vehicule")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> voyages = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "voyages", "vehicules", "employes" }, allowSetters = true)
    private Transporteur transporteur;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vehicule id(Long id) {
        this.id = id;
        return this;
    }

    public String getReference() {
        return this.reference;
    }

    public Vehicule reference(String reference) {
        this.reference = reference;
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getNumChassis() {
        return this.numChassis;
    }

    public Vehicule numChassis(String numChassis) {
        this.numChassis = numChassis;
        return this;
    }

    public void setNumChassis(String numChassis) {
        this.numChassis = numChassis;
    }

    public String getNumCarteGrise() {
        return this.numCarteGrise;
    }

    public Vehicule numCarteGrise(String numCarteGrise) {
        this.numCarteGrise = numCarteGrise;
        return this;
    }

    public void setNumCarteGrise(String numCarteGrise) {
        this.numCarteGrise = numCarteGrise;
    }

    public Integer getNbrePlace() {
        return this.nbrePlace;
    }

    public Vehicule nbrePlace(Integer nbrePlace) {
        this.nbrePlace = nbrePlace;
        return this;
    }

    public void setNbrePlace(Integer nbrePlace) {
        this.nbrePlace = nbrePlace;
    }

    public String getMarqueVoiture() {
        return this.marqueVoiture;
    }

    public Vehicule marqueVoiture(String marqueVoiture) {
        this.marqueVoiture = marqueVoiture;
        return this;
    }

    public void setMarqueVoiture(String marqueVoiture) {
        this.marqueVoiture = marqueVoiture;
    }

    public String getPhoto() {
        return this.photo;
    }

    public Vehicule photo(String photo) {
        this.photo = photo;
        return this;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getRefcartetotal() {
        return this.refcartetotal;
    }

    public Vehicule refcartetotal(String refcartetotal) {
        this.refcartetotal = refcartetotal;
        return this;
    }

    public void setRefcartetotal(String refcartetotal) {
        this.refcartetotal = refcartetotal;
    }

    public String getTypemoteur() {
        return this.typemoteur;
    }

    public Vehicule typemoteur(String typemoteur) {
        this.typemoteur = typemoteur;
        return this;
    }

    public void setTypemoteur(String typemoteur) {
        this.typemoteur = typemoteur;
    }

    public Set<Fuel> getFuels() {
        return this.fuels;
    }

    public Vehicule fuels(Set<Fuel> fuels) {
        this.setFuels(fuels);
        return this;
    }

    public Vehicule addFuel(Fuel fuel) {
        this.fuels.add(fuel);
        fuel.setVehicule(this);
        return this;
    }

    public Vehicule removeFuel(Fuel fuel) {
        this.fuels.remove(fuel);
        fuel.setVehicule(null);
        return this;
    }

    public void setFuels(Set<Fuel> fuels) {
        if (this.fuels != null) {
            this.fuels.forEach(i -> i.setVehicule(null));
        }
        if (fuels != null) {
            fuels.forEach(i -> i.setVehicule(this));
        }
        this.fuels = fuels;
    }

    public Set<Incident> getIncidents() {
        return this.incidents;
    }

    public Vehicule incidents(Set<Incident> incidents) {
        this.setIncidents(incidents);
        return this;
    }

    public Vehicule addIncident(Incident incident) {
        this.incidents.add(incident);
        incident.setVehicule(this);
        return this;
    }

    public Vehicule removeIncident(Incident incident) {
        this.incidents.remove(incident);
        incident.setVehicule(null);
        return this;
    }

    public void setIncidents(Set<Incident> incidents) {
        if (this.incidents != null) {
            this.incidents.forEach(i -> i.setVehicule(null));
        }
        if (incidents != null) {
            incidents.forEach(i -> i.setVehicule(this));
        }
        this.incidents = incidents;
    }

    public Set<Maintenance> getMaintenances() {
        return this.maintenances;
    }

    public Vehicule maintenances(Set<Maintenance> maintenances) {
        this.setMaintenances(maintenances);
        return this;
    }

    public Vehicule addMaintenance(Maintenance maintenance) {
        this.maintenances.add(maintenance);
        maintenance.setVehicule(this);
        return this;
    }

    public Vehicule removeMaintenance(Maintenance maintenance) {
        this.maintenances.remove(maintenance);
        maintenance.setVehicule(null);
        return this;
    }

    public void setMaintenances(Set<Maintenance> maintenances) {
        if (this.maintenances != null) {
            this.maintenances.forEach(i -> i.setVehicule(null));
        }
        if (maintenances != null) {
            maintenances.forEach(i -> i.setVehicule(this));
        }
        this.maintenances = maintenances;
    }

    public Set<Voyage> getVoyages() {
        return this.voyages;
    }

    public Vehicule voyages(Set<Voyage> voyages) {
        this.setVoyages(voyages);
        return this;
    }

    public Vehicule addVoyage(Voyage voyage) {
        this.voyages.add(voyage);
        voyage.setVehicule(this);
        return this;
    }

    public Vehicule removeVoyage(Voyage voyage) {
        this.voyages.remove(voyage);
        voyage.setVehicule(null);
        return this;
    }

    public void setVoyages(Set<Voyage> voyages) {
        if (this.voyages != null) {
            this.voyages.forEach(i -> i.setVehicule(null));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.setVehicule(this));
        }
        this.voyages = voyages;
    }

    public Transporteur getTransporteur() {
        return this.transporteur;
    }

    public Vehicule transporteur(Transporteur transporteur) {
        this.setTransporteur(transporteur);
        return this;
    }

    public void setTransporteur(Transporteur transporteur) {
        this.transporteur = transporteur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehicule)) {
            return false;
        }
        return id != null && id.equals(((Vehicule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehicule{" +
            "id=" + getId() +
            ", reference='" + getReference() + "'" +
            ", numChassis='" + getNumChassis() + "'" +
            ", numCarteGrise='" + getNumCarteGrise() + "'" +
            ", nbrePlace=" + getNbrePlace() +
            ", marqueVoiture='" + getMarqueVoiture() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", refcartetotal='" + getRefcartetotal() + "'" +
            ", typemoteur='" + getTypemoteur() + "'" +
            "}";
    }
}
