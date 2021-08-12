package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Pays.
 */
@Entity
@Table(name = "pays")
public class Pays implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "code")
    private String code;

    @Column(name = "indicatif")
    private String indicatif;

    @Column(name = "capitale")
    private String capitale;

    @Column(name = "currency")
    private String currency;

    @OneToMany(mappedBy = "pays")
    @JsonIgnoreProperties(value = { "departs", "arrives", "nomarret", "pays" }, allowSetters = true)
    private Set<Ville> villes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pays id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Pays nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCode() {
        return this.code;
    }

    public Pays code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getIndicatif() {
        return this.indicatif;
    }

    public Pays indicatif(String indicatif) {
        this.indicatif = indicatif;
        return this;
    }

    public void setIndicatif(String indicatif) {
        this.indicatif = indicatif;
    }

    public String getCapitale() {
        return this.capitale;
    }

    public Pays capitale(String capitale) {
        this.capitale = capitale;
        return this;
    }

    public void setCapitale(String capitale) {
        this.capitale = capitale;
    }

    public String getCurrency() {
        return this.currency;
    }

    public Pays currency(String currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Set<Ville> getVilles() {
        return this.villes;
    }

    public Pays villes(Set<Ville> villes) {
        this.setVilles(villes);
        return this;
    }

    public Pays addVille(Ville ville) {
        this.villes.add(ville);
        ville.setPays(this);
        return this;
    }

    public Pays removeVille(Ville ville) {
        this.villes.remove(ville);
        ville.setPays(null);
        return this;
    }

    public void setVilles(Set<Ville> villes) {
        if (this.villes != null) {
            this.villes.forEach(i -> i.setPays(null));
        }
        if (villes != null) {
            villes.forEach(i -> i.setPays(this));
        }
        this.villes = villes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pays)) {
            return false;
        }
        return id != null && id.equals(((Pays) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pays{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", code='" + getCode() + "'" +
            ", indicatif='" + getIndicatif() + "'" +
            ", capitale='" + getCapitale() + "'" +
            ", currency='" + getCurrency() + "'" +
            "}";
    }
}
