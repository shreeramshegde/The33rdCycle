package com.chronos.portal;

import com.chronos.portal.util.StringNormalizer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Unit Tests - String Normalization & Answer Matching")
public class StringNormalizerTest {

    @Test
    @DisplayName("Should normalize casing, dashes, spaces and extraneous terms")
    void testBasicNormalization() {
        assertEquals("CH033", StringNormalizer.normalize("CH-0-33"));
        assertEquals("CH033", StringNormalizer.normalize("ch 0 33"));
        assertEquals("CH033", StringNormalizer.normalize("  ch-0-33  "));
        assertEquals("1101", StringNormalizer.normalize("1-1-0-1"));
        assertEquals("1101", StringNormalizer.normalize("1 1 0 1"));
        assertEquals("1984", StringNormalizer.normalize("YEAR 1984"));
        assertEquals("115933", StringNormalizer.normalize("11:59:33 PM"));
    }

    @Test
    @DisplayName("Should match Checkpoint 4 (The Secondary Override) under all acceptable formats")
    void testCheckpoint4Matching() {
        String target = "CH033";
        String[] aliases = new String[]{"CH-0-33", "CH033", "CH 0 33", "CH-033", "CH_0_33"};

        assertTrue(StringNormalizer.matches("CH-0-33", target, aliases));
        assertTrue(StringNormalizer.matches("ch-0-33", target, aliases));
        assertTrue(StringNormalizer.matches("ch 0 33", target, aliases));
        assertTrue(StringNormalizer.matches("CH033", target, aliases));
        assertFalse(StringNormalizer.matches("CH-1-33", target, aliases));
        assertFalse(StringNormalizer.matches("CH-0-34", target, aliases));
    }

    @Test
    @DisplayName("Should match Checkpoint 3 (The CHRONOS Terminal) under all acceptable formats")
    void testCheckpoint3Matching() {
        String target = "1101";
        String[] aliases = new String[]{"1101", "1-1-0-1", "1 1 0 1", "1,1,0,1"};

        assertTrue(StringNormalizer.matches("1101", target, aliases));
        assertTrue(StringNormalizer.matches("1-1-0-1", target, aliases));
        assertTrue(StringNormalizer.matches("1 1 0 1", target, aliases));
        assertFalse(StringNormalizer.matches("1111", target, aliases));
        assertFalse(StringNormalizer.matches("0101", target, aliases));
    }

    @Test
    @DisplayName("Should match Checkpoint 5 (The Archival Grid) under all acceptable formats")
    void testCheckpoint5Matching() {
        String target = "1984";
        String[] aliases = new String[]{"1984", "YEAR 1984"};

        assertTrue(StringNormalizer.matches("1984", target, aliases));
        assertTrue(StringNormalizer.matches("Year 1984", target, aliases));
        assertTrue(StringNormalizer.matches("  1984  ", target, aliases));
        assertFalse(StringNormalizer.matches("2054", target, aliases));
        assertFalse(StringNormalizer.matches("1986", target, aliases));
    }

    @Test
    @DisplayName("Should match Opening Round (Timestamp Correction)")
    void testRound0Matching() {
        String target = "11:59:33";
        String[] aliases = new String[]{"11:59:33", "11:59:33 PM", "23:59:33", "115933"};

        assertTrue(StringNormalizer.matches("11:59:33", target, aliases));
        assertTrue(StringNormalizer.matches("11:59:33 PM", target, aliases));
        assertTrue(StringNormalizer.matches("115933", target, aliases));
        assertFalse(StringNormalizer.matches("11:59:18", target, aliases));
    }
}
