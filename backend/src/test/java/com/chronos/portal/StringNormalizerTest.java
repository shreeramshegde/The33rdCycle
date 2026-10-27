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
        assertEquals("1993AND2059", StringNormalizer.normalize("1993 and 2059"));
        assertEquals("1993AND2059", StringNormalizer.normalize("1993 & 2059"));
        assertEquals("235933", StringNormalizer.normalize("23:59:33"));
        assertEquals("115933", StringNormalizer.normalize("11:59:33 PM"));
    }

    @Test
    @DisplayName("Should match Checkpoint 1 (1993 and 2059) under all acceptable formats")
    void testCheckpoint1Matching() {
        String target = "1993AND2059";
        String[] aliases = new String[]{
                "1993 and 2059", "1993 & 2059", "1993, 2059", "1993 2059", "1993-2059", "1993/2059",
                "19932059", "1993AND2059", "2059 and 1993", "2059 & 1993", "2059, 1993", "2059 1993",
                "2059-1993", "2059AND1993", "YEAR 1993 AND YEAR 2059", "1993,2059"
        };

        assertTrue(StringNormalizer.matches("1993 and 2059", target, aliases));
        assertTrue(StringNormalizer.matches("1993 & 2059", target, aliases));
        assertTrue(StringNormalizer.matches("1993, 2059", target, aliases));
        assertTrue(StringNormalizer.matches("1993 2059", target, aliases));
        assertTrue(StringNormalizer.matches("2059 and 1993", target, aliases));
        assertTrue(StringNormalizer.matches("2059 & 1993", target, aliases));
        assertTrue(StringNormalizer.matches("Year 1993 and Year 2059", target, aliases));
        assertTrue(StringNormalizer.matches("1993-2059", target, aliases));
        assertFalse(StringNormalizer.matches("1993 and 2026", target, aliases));
        assertFalse(StringNormalizer.matches("1993", target, aliases));
        assertFalse(StringNormalizer.matches("2059", target, aliases));
    }

    @Test
    @DisplayName("Should match Checkpoint 2 (The Unreliable Witness - RECORD3)")
    void testCheckpoint2Matching() {
        String target = "RECORD3";
        String[] aliases = new String[]{"RECORD 3", "3", "RECORD3", "REC 3", "RECORD-3", "RECORD_3"};

        assertTrue(StringNormalizer.matches("RECORD3", target, aliases));
        assertTrue(StringNormalizer.matches("Record 3", target, aliases));
        assertTrue(StringNormalizer.matches("record-3", target, aliases));
        assertTrue(StringNormalizer.matches("3", target, aliases));
        assertTrue(StringNormalizer.matches("REC 3", target, aliases));
        assertFalse(StringNormalizer.matches("RECORD2", target, aliases));
        assertFalse(StringNormalizer.matches("1993 and 2059", target, aliases));
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
        String target = "23:59:33";
        String[] aliases = new String[]{"23:59:33", "235933", "11:59:33", "11:59:33 PM", "115933", "23:59:33 PM", "23.59.33", "11.59.33", "23 59 33", "11 59 33"};

        assertTrue(StringNormalizer.matches("23:59:33", target, aliases));
        assertTrue(StringNormalizer.matches("235933", target, aliases));
        assertTrue(StringNormalizer.matches("11:59:33", target, aliases));
        assertTrue(StringNormalizer.matches("11:59:33 PM", target, aliases));
        assertTrue(StringNormalizer.matches("23.59.33", target, aliases));
        assertTrue(StringNormalizer.matches("  23:59:33  ", target, aliases));
        assertFalse(StringNormalizer.matches("23:59:18", target, aliases));
        assertFalse(StringNormalizer.matches("1984", target, aliases));
    }
}
