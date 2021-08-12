package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeDePaiementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeDePaiement.class);
        TypeDePaiement typeDePaiement1 = new TypeDePaiement();
        typeDePaiement1.setId(1L);
        TypeDePaiement typeDePaiement2 = new TypeDePaiement();
        typeDePaiement2.setId(typeDePaiement1.getId());
        assertThat(typeDePaiement1).isEqualTo(typeDePaiement2);
        typeDePaiement2.setId(2L);
        assertThat(typeDePaiement1).isNotEqualTo(typeDePaiement2);
        typeDePaiement1.setId(null);
        assertThat(typeDePaiement1).isNotEqualTo(typeDePaiement2);
    }
}
