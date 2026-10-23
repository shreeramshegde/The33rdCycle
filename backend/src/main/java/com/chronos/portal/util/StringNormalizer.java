package com.chronos.portal.util;

public class StringNormalizer {

    /**
     * Strips all spaces, dashes, colons, underscores, and commas,
     * strips extraneous phrases like "PM", "YEAR",
     * and converts to uppercase for flexible, error-tolerant comparison.
     */
    public static String normalize(String input) {
        if (input == null) {
            return "";
        }
        String clean = input.trim().toUpperCase();

        // Remove trailing or leading words like "YEAR", "PM", "AM"
        clean = clean.replaceAll("\\bYEAR\\b", "")
                     .replaceAll("\\bPM\\b", "")
                     .replaceAll("\\bAM\\b", "");

        // Remove all non-alphanumeric characters (spaces, dashes, colons, commas, dots)
        clean = clean.replaceAll("[^A-Z0-9]", "");
        return clean;
    }

    /**
     * Checks if the user's submitted string matches either the normalized ground-truth answer
     * or any of the accepted aliases.
     */
    public static boolean matches(String submitted, String normalizedTarget, String[] aliases) {
        if (submitted == null) {
            return false;
        }

        String normalizedUser = normalize(submitted);
        String targetClean = normalize(normalizedTarget);

        // Direct normalized equality
        if (normalizedUser.equalsIgnoreCase(targetClean)) {
            return true;
        }

        // Check against aliases
        if (aliases != null) {
            for (String alias : aliases) {
                if (normalizedUser.equalsIgnoreCase(normalize(alias))) {
                    return true;
                }
            }
        }

        return false;
    }
}
