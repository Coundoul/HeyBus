package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Ville.
 */
@Entity
@Table(name = "ville")
public class Ville implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "code_postal")
    private String codePostal;

    @OneToMany(mappedBy = "departVille")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> departs = new HashSet<>();

    @OneToMany(mappedBy = "arriveVille")
    @JsonIgnoreProperties(
        value = { "reservations", "employes", "arrets", "vehicule", "departVille", "arriveVille", "transporteur" },
        allowSetters = true
    )
    private Set<Voyage> arrives = new HashSet<>();

    @JsonIgnoreProperties(value = { "nomarretVille", "voyages" }, allowSetters = true)
    @OneToOne(mappedBy = "nomarretVille")
    private Arret nomarret;

    @ManyToOne
    @JsonIgnoreProperties(value = { "villes" }, allowSetters = true)
    private Pays pays;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ville id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Ville nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCodePostal() {
        return this.codePostal;
    }

    public Ville codePostal(String codePostal) {
        this.codePostal = codePostal;
        return this;
    }

    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }

    public Set<Voyage> getDeparts() {
        return this.departs;
    }

    public Ville departs(Set<Voyage> voyages) {
        this.setDeparts(voyages);
        return this;
    }

    public Ville addDepart(Voyage voyage) {
        this.departs.add(voyage);
        voyage.setDepartVille(this);
        return this;
    }

    public Ville removeDepart(Voyage voyage) {
        this.departs.remove(voyage);
        voyage.setDepartVille(null);
        return this;
    }

    public void setDeparts(Set<Voyage> voyages) {
        if (this.departs != null) {
            this.departs.forEach(i -> i.setDepartVille(null));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.setDepartVille(this));
        }
        this.departs = voyages;
    }

    public Set<Voyage> getArrives() {
        return this.arrives;
    }

    public Ville arrives(Set<Voyage> voyages) {
        this.setArrives(voyages);
        return this;
    }

    public Ville addArrive(Voyage voyage) {
        this.arrives.add(voyage);
        voyage.setArriveVille(this);
        return this;
    }

    public Ville removeArrive(Voyage voyage) {
        this.arrives.remove(voyage);
        voyage.setArriveVille(null);
        return this;
    }

    public void setArrives(Set<Voyage> voyages) {
        if (this.arrives != null) {
            this.arrives.forEach(i -> i.setArriveVille(null));
        }
        if (voyages != null) {
            voyages.forEach(i -> i.setArriveVille(this));
        }
        this.arrives = voyages;
    }

    public Arret getNomarret() {
        return this.nomarret;
    }

    public Ville nomarret(Arret arret) {
        this.setNomarret(arret);
        return this;
    }

    public void setNomarret(Arret arret) {
        if (this.nomarret != null) {
            this.nomarret.setNomarretVille(null);
        }
        if (nomarret != null) {
            nomarret.setNomarretVille(this);
        }
        this.nomarret = arret;
    }

    public Pays getPays() {
        return this.pays;
    }

    public Ville pays(Pays pays) {
        this.setPays(pays);
        return this;
    }

    public void setPays(Pays pays) {
        this.pays = pays;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ville)) {
            return false;
        }
        return id != null && id.equals(((Ville) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ville{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", codePostal='" + getCodePostal() + "'" +
            "}";
    }
}
