package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Agence.
 */
@Entity
@Table(name = "agence")
public class Agence implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @NotNull
    @Column(name = "telephone", nullable = false)
    private String telephone;

    @Column(name = "responsable")
    private String responsable;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agences" }, allowSetters = true)
    private Revenu revenu;

    @ManyToOne
    @JsonIgnoreProperties(value = { "agences" }, allowSetters = true)
    private Depense depense;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Agence id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Agence nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Agence telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getResponsable() {
        return this.responsable;
    }

    public Agence responsable(String responsable) {
        this.responsable = responsable;
        return this;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public Revenu getRevenu() {
        return this.revenu;
    }

    public Agence revenu(Revenu revenu) {
        this.setRevenu(revenu);
        return this;
    }

    public void setRevenu(Revenu revenu) {
        this.revenu = revenu;
    }

    public Depense getDepense() {
        return this.depense;
    }

    public Agence depense(Depense depense) {
        this.setDepense(depense);
        return this;
    }

    public void setDepense(Depense depense) {
        this.depense = depense;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Agence)) {
            return false;
        }
        return id != null && id.equals(((Agence) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Agence{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", responsable='" + getResponsable() + "'" +
            "}";
    }
}
