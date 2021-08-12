package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgenceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Agence.class);
        Agence agence1 = new Agence();
        agence1.setId(1L);
        Agence agence2 = new Agence();
        agence2.setId(agence1.getId());
        assertThat(agence1).isEqualTo(agence2);
        agence2.setId(2L);
        assertThat(agence1).isNotEqualTo(agence2);
        agence1.setId(null);
        assertThat(agence1).isNotEqualTo(agence2);
    }
}
