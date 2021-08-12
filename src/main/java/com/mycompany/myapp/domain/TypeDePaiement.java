package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A TypeDePaiement.
 */
@Entity
@Table(name = "type_de_paiement")
public class TypeDePaiement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "paiement", nullable = false)
    private String paiement;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeDePaiement id(Long id) {
        this.id = id;
        return this;
    }

    public String getPaiement() {
        return this.paiement;
    }

    public TypeDePaiement paiement(String paiement) {
        this.paiement = paiement;
        return this;
    }

    public void setPaiement(String paiement) {
        this.paiement = paiement;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeDePaiement)) {
            return false;
        }
        return id != null && id.equals(((TypeDePaiement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeDePaiement{" +
            "id=" + getId() +
            ", paiement='" + getPaiement() + "'" +
            "}";
    }
}
