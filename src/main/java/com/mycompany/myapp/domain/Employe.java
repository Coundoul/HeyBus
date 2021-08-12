package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Matrimoniale;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Employe.
 */
@Entity
@Table(name = "employe")
public class Employe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    @Column(name = "matrimoniale")
    private Matrimoniale matrimoniale;

    @NotNull
    @Column(name = "telephone", nullable = false, unique = true)
    private String telephone;

    @Column(name = "nbre_enfant")
    private Integer nbreEnfant;

    @Column(name = "photo")
    private String photo;

    @Column(name = "account")
    private Boolean account;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "employes", "section" }, allowSetters = true)
    private Position position;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "voyages", "vehicules", "employes" }, allowSetters = true)
    private Transporteur transporteur;

    @ManyToMany(mappedBy = "employes")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> voyages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employe id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Employe nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Employe prenom(String prenom) {
        this.prenom = prenom;
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Employe dateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public Matrimoniale getMatrimoniale() {
        return this.matrimoniale;
    }

    public Employe matrimoniale(Matrimoniale matrimoniale) {
        this.matrimoniale = matrimoniale;
        return this;
    }

    public void setMatrimoniale(Matrimoniale matrimoniale) {
        this.matrimoniale = matrimoniale;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Employe telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Integer getNbreEnfant() {
        return this.nbreEnfant;
    }

    public Employe nbreEnfant(Integer nbreEnfant) {
        this.nbreEnfant = nbreEnfant;
        return this;
    }

    public void setNbreEnfant(Integer nbreEnfant) {
        this.nbreEnfant = nbreEnfant;
    }

    public String getPhoto() {
        return this.photo;
    }

    public Employe photo(String photo) {
        this.photo = photo;
        return this;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Boolean getAccount() {
        return this.account;
    }

    public Employe account(Boolean account) {
        this.account = account;
        return this;
    }

    public void setAccount(Boolean account) {
        this.account = account;
    }

    public User getUser() {
        return this.user;
    }

    public Employe user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Position getPosition() {
        return this.position;
    }

    public Employe position(Position position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Transporteur getTransporteur() {
        return this.transporteur;
    }

    public Employe transporteur(Transporteur transporteur) {
        this.setTransporteur(transporteur);
        return this;
    }

    public void setTransporteur(Transporteur transporteur) {
        this.transporteur = transporteur;
    }

    public Set<Voyage> getVoyages() {
        return this.voyages;
    }

    public Employe voyages(Set<Voyage> voyages) {
        this.setVoyages(voyages);
        return this;
    }

    public Employe addVoyage(Voyage voyage) {
        this.voyages.add(voyage);
        voyage.getEmployes().add(this);
        return this;
    }

    public Employe removeVoyage(Voyage voyage) {
        this.voyages.remove(voyage);
        voyage.getEmployes().remove(this);
        return this;
    }

    public void setVoyages(Set<Voyage> voyages) {
        if (this.voyages != null) {
            this.voyages.forEach(i -> i.removeEmploye(this));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.addEmploye(this));
        }
        this.voyages = voyages;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employe)) {
            return false;
        }
        return id != null && id.equals(((Employe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employe{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", matrimoniale='" + getMatrimoniale() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", nbreEnfant=" + getNbreEnfant() +
            ", photo='" + getPhoto() + "'" +
            ", account='" + getAccount() + "'" +
            "}";
    }
}
