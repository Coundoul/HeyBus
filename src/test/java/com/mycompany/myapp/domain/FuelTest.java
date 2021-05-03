package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FuelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fuel.class);
        Fuel fuel1 = new Fuel();
        fuel1.setId(1L);
        Fuel fuel2 = new Fuel();
        fuel2.setId(fuel1.getId());
        assertThat(fuel1).isEqualTo(fuel2);
        fuel2.setId(2L);
        assertThat(fuel1).isNotEqualTo(fuel2);
        fuel1.setId(null);
        assertThat(fuel1).isNotEqualTo(fuel2);
    }
}
