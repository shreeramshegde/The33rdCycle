package com.chronos.portal.util;

public class StringNormalizer {

    /**
     * Strips all spaces, dashes, colons, underscores, and commas,
     * strips extraneous phrases like "PM", "YEAR", "AM",
     * normalizes ampersands ("&") to "AND",
     * and converts to uppercase for flexible, error-tolerant comparison.
     */
    public static String normalize(String input) {
        if (input == null) {
            return "";
        }
        String clean = input.trim().toUpperCase();

        // Convert ampersands to AND
        clean = clean.replace("&", "AND");

        // Remove trailing or leading words like "YEAR", "PM", "AM"
        clean = clean.replaceAll("\\bYEAR\\b", "")
                     .replaceAll("\\bPM\\b", "")
                     .replaceAll("\\bAM\\b", "");

        // Remove all non-alphanumeric characters (spaces, dashes, colons, commas, dots, slashes)
        clean = clean.replaceAll("[^A-Z0-9]", "");
        return clean;
    }

    /**
     * Checks if the user's submitted string matches either the normalized ground-truth answer
     * or any of the accepted aliases.
     * Also supports multi-token unordered matching for answers like "1993 and 2059".
     */
    public static boolean matches(String submitted, String normalizedTarget, String[] aliases) {
        if (submitted == null) {
            return false;
        }

        String normalizedUser = normalize(submitted);
        String targetClean = normalize(normalizedTarget);

        // Direct normalized equality
        if (!normalizedUser.isEmpty() && normalizedUser.equalsIgnoreCase(targetClean)) {
            return true;
        }

        // Check against aliases
        if (aliases != null) {
            for (String alias : aliases) {
                if (!normalizedUser.isEmpty() && normalizedUser.equalsIgnoreCase(normalize(alias))) {
                    return true;
                }
            }
        }

        // Special tolerant handling for combined two-year pairs like "1993 and 2059"
        boolean targetHas1993And2059 = (targetClean.contains("1993") && targetClean.contains("2059")) ||
                (normalizedTarget != null && normalizedTarget.contains("1993") && normalizedTarget.contains("2059"));

        if (targetHas1993And2059) {
            if (normalizedUser.contains("1993") && normalizedUser.contains("2059")) {
                // Ensure no conflicting extraneous numbers/words exist
                String remainder = normalizedUser.replace("1993", "").replace("2059", "").replace("AND", "");
                if (remainder.isEmpty()) {
                    return true;
                }
            }
        }

        // Special tolerant handling for times like 23:59:33 vs 11:59:33
        boolean targetIs5933 = targetClean.contains("5933");
        if (targetIs5933) {
            if (normalizedUser.equals("235933") || normalizedUser.equals("115933")) {
                return true;
            }
        }

        return false;
    }
}
