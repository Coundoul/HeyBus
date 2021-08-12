package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TypeVoyage;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Voyage.
 */
@Entity
@Table(name = "voyage")
public class Voyage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_de_voyage", nullable = false)
    private ZonedDateTime dateDeVoyage;

    @Column(name = "date_retour")
    private ZonedDateTime dateRetour;

    @Column(name = "date_arrivee")
    private ZonedDateTime dateArrivee;

    @Column(name = "prix")
    private Integer prix;

    @Column(name = "nbre_place")
    private Integer nbrePlace;

    @Column(name = "adresse_depart")
    private String adresseDepart;

    @Column(name = "adresse_arrive")
    private String adresseArrive;

    @Column(name = "quartier")
    private String quartier;

    @Column(name = "description")
    private String description;

    @Column(name = "climatisation")
    private Boolean climatisation;

    @Column(name = "wifi")
    private Boolean wifi;

    @Column(name = "toilette")
    private Boolean toilette;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_voyage")
    private TypeVoyage typeVoyage;

    @OneToMany(mappedBy = "voyage")
    @JsonIgnoreProperties(value = { "voyage", "customer" }, allowSetters = true)
    private Set<Reservation> reservations = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_voyage__employe",
        joinColumns = @JoinColumn(name = "voyage_id"),
        inverseJoinColumns = @JoinColumn(name = "employe_id")
    )
    @JsonIgnoreProperties(value = { "user", "position", "transporteur", "voyages" }, allowSetters = true)
    private Set<Employe> employes = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_voyage__arret",
        joinColumns = @JoinColumn(name = "voyage_id"),
        inverseJoinColumns = @JoinColumn(name = "arret_id")
    )
    @JsonIgnoreProperties(value = { "nomarretVille", "voyages" }, allowSetters = true)
    private Set<Arret> arrets = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "fuels", "incidents", "maintenances", "voyages", "transporteur" }, allowSetters = true)
    private Vehicule vehicule;

    @ManyToOne
    @JsonIgnoreProperties(value = { "departs", "arrives", "nomarret", "pays" }, allowSetters = true)
    private Ville departVille;

    @ManyToOne
    @JsonIgnoreProperties(value = { "departs", "arrives", "nomarret", "pays" }, allowSetters = true)
    private Ville arriveVille;

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

    public Voyage id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getDateDeVoyage() {
        return this.dateDeVoyage;
    }

    public Voyage dateDeVoyage(ZonedDateTime dateDeVoyage) {
        this.dateDeVoyage = dateDeVoyage;
        return this;
    }

    public void setDateDeVoyage(ZonedDateTime dateDeVoyage) {
        this.dateDeVoyage = dateDeVoyage;
    }

    public ZonedDateTime getDateRetour() {
        return this.dateRetour;
    }

    public Voyage dateRetour(ZonedDateTime dateRetour) {
        this.dateRetour = dateRetour;
        return this;
    }

    public void setDateRetour(ZonedDateTime dateRetour) {
        this.dateRetour = dateRetour;
    }

    public ZonedDateTime getDateArrivee() {
        return this.dateArrivee;
    }

    public Voyage dateArrivee(ZonedDateTime dateArrivee) {
        this.dateArrivee = dateArrivee;
        return this;
    }

    public void setDateArrivee(ZonedDateTime dateArrivee) {
        this.dateArrivee = dateArrivee;
    }

    public Integer getPrix() {
        return this.prix;
    }

    public Voyage prix(Integer prix) {
        this.prix = prix;
        return this;
    }

    public void setPrix(Integer prix) {
        this.prix = prix;
    }

    public Integer getNbrePlace() {
        return this.nbrePlace;
    }

    public Voyage nbrePlace(Integer nbrePlace) {
        this.nbrePlace = nbrePlace;
        return this;
    }

    public void setNbrePlace(Integer nbrePlace) {
        this.nbrePlace = nbrePlace;
    }

    public String getAdresseDepart() {
        return this.adresseDepart;
    }

    public Voyage adresseDepart(String adresseDepart) {
        this.adresseDepart = adresseDepart;
        return this;
    }

    public void setAdresseDepart(String adresseDepart) {
        this.adresseDepart = adresseDepart;
    }

    public String getAdresseArrive() {
        return this.adresseArrive;
    }

    public Voyage adresseArrive(String adresseArrive) {
        this.adresseArrive = adresseArrive;
        return this;
    }

    public void setAdresseArrive(String adresseArrive) {
        this.adresseArrive = adresseArrive;
    }

    public String getQuartier() {
        return this.quartier;
    }

    public Voyage quartier(String quartier) {
        this.quartier = quartier;
        return this;
    }

    public void setQuartier(String quartier) {
        this.quartier = quartier;
    }

    public String getDescription() {
        return this.description;
    }

    public Voyage description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getClimatisation() {
        return this.climatisation;
    }

    public Voyage climatisation(Boolean climatisation) {
        this.climatisation = climatisation;
        return this;
    }

    public void setClimatisation(Boolean climatisation) {
        this.climatisation = climatisation;
    }

    public Boolean getWifi() {
        return this.wifi;
    }

    public Voyage wifi(Boolean wifi) {
        this.wifi = wifi;
        return this;
    }

    public void setWifi(Boolean wifi) {
        this.wifi = wifi;
    }

    public Boolean getToilette() {
        return this.toilette;
    }

    public Voyage toilette(Boolean toilette) {
        this.toilette = toilette;
        return this;
    }

    public void setToilette(Boolean toilette) {
        this.toilette = toilette;
    }

    public TypeVoyage getTypeVoyage() {
        return this.typeVoyage;
    }

    public Voyage typeVoyage(TypeVoyage typeVoyage) {
        this.typeVoyage = typeVoyage;
        return this;
    }

    public void setTypeVoyage(TypeVoyage typeVoyage) {
        this.typeVoyage = typeVoyage;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public Voyage reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Voyage addReservation(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.setVoyage(this);
        return this;
    }

    public Voyage removeReservation(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.setVoyage(null);
        return this;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.setVoyage(null));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.setVoyage(this));
        }
        this.reservations = reservations;
    }

    public Set<Employe> getEmployes() {
        return this.employes;
    }

    public Voyage employes(Set<Employe> employes) {
        this.setEmployes(employes);
        return this;
    }

    public Voyage addEmploye(Employe employe) {
        this.employes.add(employe);
        employe.getVoyages().add(this);
        return this;
    }

    public Voyage removeEmploye(Employe employe) {
        this.employes.remove(employe);
        employe.getVoyages().remove(this);
        return this;
    }

    public void setEmployes(Set<Employe> employes) {
        this.employes = employes;
    }

    public Set<Arret> getArrets() {
        return this.arrets;
    }

    public Voyage arrets(Set<Arret> arrets) {
        this.setArrets(arrets);
        return this;
    }

    public Voyage addArret(Arret arret) {
        this.arrets.add(arret);
        arret.getVoyages().add(this);
        return this;
    }

    public Voyage removeArret(Arret arret) {
        this.arrets.remove(arret);
        arret.getVoyages().remove(this);
        return this;
    }

    public void setArrets(Set<Arret> arrets) {
        this.arrets = arrets;
    }

    public Vehicule getVehicule() {
        return this.vehicule;
    }

    public Voyage vehicule(Vehicule vehicule) {
        this.setVehicule(vehicule);
        return this;
    }

    public void setVehicule(Vehicule vehicule) {
        this.vehicule = vehicule;
    }

    public Ville getDepartVille() {
        return this.departVille;
    }

    public Voyage departVille(Ville ville) {
        this.setDepartVille(ville);
        return this;
    }

    public void setDepartVille(Ville ville) {
        this.departVille = ville;
    }

    public Ville getArriveVille() {
        return this.arriveVille;
    }

    public Voyage arriveVille(Ville ville) {
        this.setArriveVille(ville);
        return this;
    }

    public void setArriveVille(Ville ville) {
        this.arriveVille = ville;
    }

    public Transporteur getTransporteur() {
        return this.transporteur;
    }

    public Voyage transporteur(Transporteur transporteur) {
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
        if (!(o instanceof Voyage)) {
            return false;
        }
        return id != null && id.equals(((Voyage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Voyage{" +
            "id=" + getId() +
            ", dateDeVoyage='" + getDateDeVoyage() + "'" +
            ", dateRetour='" + getDateRetour() + "'" +
            ", dateArrivee='" + getDateArrivee() + "'" +
            ", prix=" + getPrix() +
            ", nbrePlace=" + getNbrePlace() +
            ", adresseDepart='" + getAdresseDepart() + "'" +
            ", adresseArrive='" + getAdresseArrive() + "'" +
            ", quartier='" + getQuartier() + "'" +
            ", description='" + getDescription() + "'" +
            ", climatisation='" + getClimatisation() + "'" +
            ", wifi='" + getWifi() + "'" +
            ", toilette='" + getToilette() + "'" +
            ", typeVoyage='" + getTypeVoyage() + "'" +
            "}";
    }
}
