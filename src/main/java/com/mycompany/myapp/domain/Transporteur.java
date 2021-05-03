package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Transporteur.
 */
@Entity
@Table(name = "transporteur")
public class Transporteur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "telephone", nullable = false)
    private String telephone;

    @NotNull
    @Column(name = "responsable", nullable = false)
    private String responsable;

    @Column(name = "mail")
    private String mail;

    @NotNull
    @Column(name = "adresse", nullable = false)
    private String adresse;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "transporteur")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> voyages = new HashSet<>();

    @OneToMany(mappedBy = "transporteur")
    @JsonIgnoreProperties(value = { "fuels", "incidents", "maintenances", "voyages", "transporteur" }, allowSetters = true)
    private Set<Vehicule> vehicules = new HashSet<>();

    @OneToMany(mappedBy = "transporteur")
    @JsonIgnoreProperties(value = { "user", "position", "transporteur", "voyages" }, allowSetters = true)
    private Set<Employe> employes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transporteur id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Transporteur nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Transporteur telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getResponsable() {
        return this.responsable;
    }

    public Transporteur responsable(String responsable) {
        this.responsable = responsable;
        return this;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getMail() {
        return this.mail;
    }

    public Transporteur mail(String mail) {
        this.mail = mail;
        return this;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Transporteur adresse(String adresse) {
        this.adresse = adresse;
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public Transporteur logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public Transporteur logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public User getUser() {
        return this.user;
    }

    public Transporteur user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Voyage> getVoyages() {
        return this.voyages;
    }

    public Transporteur voyages(Set<Voyage> voyages) {
        this.setVoyages(voyages);
        return this;
    }

    public Transporteur addVoyage(Voyage voyage) {
        this.voyages.add(voyage);
        voyage.setTransporteur(this);
        return this;
    }

    public Transporteur removeVoyage(Voyage voyage) {
        this.voyages.remove(voyage);
        voyage.setTransporteur(null);
        return this;
    }

    public void setVoyages(Set<Voyage> voyages) {
        if (this.voyages != null) {
            this.voyages.forEach(i -> i.setTransporteur(null));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.setTransporteur(this));
        }
        this.voyages = voyages;
    }

    public Set<Vehicule> getVehicules() {
        return this.vehicules;
    }

    public Transporteur vehicules(Set<Vehicule> vehicules) {
        this.setVehicules(vehicules);
        return this;
    }

    public Transporteur addVehicule(Vehicule vehicule) {
        this.vehicules.add(vehicule);
        vehicule.setTransporteur(this);
        return this;
    }

    public Transporteur removeVehicule(Vehicule vehicule) {
        this.vehicules.remove(vehicule);
        vehicule.setTransporteur(null);
        return this;
    }

    public void setVehicules(Set<Vehicule> vehicules) {
        if (this.vehicules != null) {
            this.vehicules.forEach(i -> i.setTransporteur(null));
        }
        if (vehicules != null) {
            vehicules.forEach(i -> i.setTransporteur(this));
        }
        this.vehicules = vehicules;
    }

    public Set<Employe> getEmployes() {
        return this.employes;
    }

    public Transporteur employes(Set<Employe> employes) {
        this.setEmployes(employes);
        return this;
    }

    public Transporteur addEmploye(Employe employe) {
        this.employes.add(employe);
        employe.setTransporteur(this);
        return this;
    }

    public Transporteur removeEmploye(Employe employe) {
        this.employes.remove(employe);
        employe.setTransporteur(null);
        return this;
    }

    public void setEmployes(Set<Employe> employes) {
        if (this.employes != null) {
            this.employes.forEach(i -> i.setTransporteur(null));
        }
        if (employes != null) {
            employes.forEach(i -> i.setTransporteur(this));
        }
        this.employes = employes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transporteur)) {
            return false;
        }
        return id != null && id.equals(((Transporteur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transporteur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", responsable='" + getResponsable() + "'" +
            ", mail='" + getMail() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            "}";
    }
}
