
export enum FormatType {
    Standard,
    Custom
}

export type StandardFormat = {
    type: FormatType.Standard,
    name: string
}

export type CustomFormat = {
    type: FormatType.Custom,
    name: string,
    setCodes: string[]
}

export type Format = StandardFormat | CustomFormat;

// Equivalent to "anything goes"
export const emptyFormat : Format = { type: FormatType.Standard, name: "" };

const customFormat = (name: string, setCodes: string[]) => ({
    type: FormatType.Custom,
    name,
    setCodes
});

export const customFormats : Format[] = [
    customFormat('Pre-block (Old School + Fallen Empires)', ['leb', 'arn', 'atq', 'leg', 'drk', 'fem']),
    customFormat('Block - Ice Age (Homelands)', ['ice', 'all', 'hml' ]),
    customFormat('Block - Ice Age (Cold Snap)', ['ice', 'all', 'csp']),
    customFormat('Block - Mirage', ['mir', 'vis', 'wth']),
    customFormat('Block - Tempest', ['tmp', 'sth', 'exo']),
    customFormat('Block - Urza', ['usg', 'ulg', 'uds']),
    customFormat('Block - Mercadian', ['mmq', 'nem', 'pcy']),
    customFormat('Block - Invasion', ['inv', 'pls', 'apc']),
    customFormat('Block - Odyssey', ['ody', 'tor', 'jud']),
    customFormat('Block - Onslaught', ['ons', 'lgn', 'scg']),
    customFormat('Block - Mirrodin', ['mrd', 'dst', '5dn']),
    customFormat('Block - Kamigawa', ['chk', 'bok', 'sok']),
    customFormat('Block - Ravnica: City of Guilds', ['rav', 'gpt', 'dis']),
    customFormat('Block - Time Spiral', ['tsp', 'plc', 'fut']),
    customFormat('Block - Lorwyn/Shadowmoor', ['lrw', 'mor', 'shm', 'eve']),
    customFormat('Block - Alara', ['ala', 'con', 'arb']),
    customFormat('Block - Zendikar', ['zen', 'wwk', 'roe']),
    customFormat('Block - Scars of Mirrodin', ['som', 'mbs', 'nph']),
    customFormat('Block - Innistrad', ['isd', 'dka', 'avr']),
    customFormat('Block - Return to Ravnica', ['rtr', 'gtc', 'dgm']),
    customFormat('Block - Theros', ['ths', 'bng', 'jou']),
    customFormat('Block - Tarkir', ['ktk', 'frf', 'dtk']),
    customFormat('Block - Battle for Zendikar', ['bfz', 'ogw']),
    customFormat('Block - Shadows over Innistrad', ['soi', 'emn']),
    customFormat('Block - Kaladesh', ['kld', 'aer']),
    customFormat('Block - Amonkhet', ['akh', 'hou']),
    customFormat('Block - Ixalan', ['xln', 'rix']),
    customFormat('Plane - Dominaria', ['leb', 'atq', 'leg', 'drk', 'fem', 'ice', 'all', 'csp',
        'mir', 'vis', 'wth', 'usg', 'ulg', 'uds','pcy',
        'ody', 'tor', 'jud', 'ons', 'lgn', 'scg',
        'dom', 'dmu', 'bro']),
    customFormat('Plane - Rath', ['tmp', 'sth', 'exo', 'nem', 'tsp', 'plc', 'fut']),
    customFormat('Plane - Mirrodin', ['mrd', 'dst', '5dn', 'som', 'mbs', 'nph']),
    customFormat('Plane - Ravnica', ['rav', 'gpt', 'dis','rtr', 'gtc', 'dgm', 'grn', 'rna', 'war']),
    customFormat('Plane - Zendikar', ['zen', 'wwk', 'roe', 'bfz', 'ogw', 'znr']),
    customFormat('Plane - Innistrad', ['isd', 'dka', 'avr', 'soi', 'emn', 'mid', 'vow']),
    customFormat('Plane - Theros', ['ths', 'bng', 'jou', 'thb'])
];