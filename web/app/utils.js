const statuses = [
    'CREATED',
    'PREPARING',
    'READY',
    'IN_DELIVERY',
    'DELIVERED',
    'REFUSED',
];

const finalStatuses = statuses.slice(-2);

/**
 * Returns the localized label of the given status or the 'unknown' label.
 */
function getStatusI18nKey(status) {
    if (statuses.includes(status)) {
        return `ohmStatus.${status}`;
    }
    return 'ohmStatus.UNKNOWN';
}

/**
 * Returns whether the given status is an end status.
 */
function isFinal(status) {
    return finalStatuses.includes(status);
}


/**
 * Returns the next immediate status(es) of the given status, as select option object(s).
 */
function getStatusOptions(start, $translate) {
    const options = [];
    if (!isFinal(start)) {
        if (start === 'IN_DELIVERY') {
            for (const nextStatus of finalStatuses) {
                options.push({ label: $translate.instant(`ohmStatus.${nextStatus}`), value: nextStatus });
            }
        } else {
            const index = statuses.indexOf(start);
            if (index >= 0) {
                const nextStatus = statuses[index + 1];
                options.push({ label: $translate.instant(`ohmStatus.${nextStatus}`), value: nextStatus });
            }
        }
    }
    return options;
}