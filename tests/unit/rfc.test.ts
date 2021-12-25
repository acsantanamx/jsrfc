import { Rfc } from '../../src';

describe('Rfc', () => {
    test('create rfc persona fisica', () => {
        const input = 'COSC8001137NA';
        const rfc = Rfc.unparsed(input);
        expect(rfc.getRfc()).toBe(input);
        expect(`${rfc}`).toBe(input);
        expect(rfc.isGeneric()).toBeFalsy();
        expect(rfc.isForeign()).toBeFalsy();
        expect(rfc.isMoral()).toBeFalsy();
        expect(rfc.isFisica()).toBeTruthy();
        expect(rfc.calculateChecksum()).toBe('A');
        expect(rfc.doesCheckSumMatch()).toBeTruthy();
        expect(rfc.calculateSerial()).toBe(40270344269627);
    });

    test('create rfc moral', () => {
        const input = 'DIM8701081LA';
        const rfc = Rfc.unparsed(input);
        expect(rfc.getRfc()).toBe(input);
        expect(`${rfc}`).toBe(input);
        expect(rfc.isGeneric()).toBeFalsy();
        expect(rfc.isForeign()).toBeFalsy();
        expect(rfc.isMoral()).toBeTruthy();
        expect(rfc.isFisica()).toBeFalsy();
        expect(rfc.calculateChecksum()).toBe('A');
        expect(rfc.doesCheckSumMatch()).toBeTruthy();
        expect(rfc.calculateSerial()).toBe(1348025748541);
    });

    test('create with foreign', () => {
        const rfc = Rfc.unparsed(Rfc.RFC_FOREIGN);
        expect(rfc.isForeign()).toBeTruthy();
        expect(rfc.isFisica()).toBeTruthy();
        expect(rfc.isGeneric()).toBeFalsy();
        expect(rfc.isMoral()).toBeFalsy();
    });

    test('create with generic', () => {
        const rfc = Rfc.unparsed(Rfc.RFC_GENERIC);
        expect(rfc.isGeneric()).toBeTruthy();
        expect(rfc.isFisica()).toBeTruthy();
        expect(rfc.isForeign()).toBeFalsy();
        expect(rfc.isMoral()).toBeFalsy();
    });

    test('parse', () => {
        const rfc = Rfc.parse('COSC8001137NA');
        expect(`${rfc}`).toBe('COSC8001137NA');
        expect(rfc.toString()).toBe('COSC8001137NA');
        expect(rfc.toLocaleString()).toBe('COSC8001137NA');
    });

    test('parse error', () => {
        expect(() => Rfc.parse('COSC800113-7NA')).toThrow('valid parts');
    });

    test('parse or null', () => {
        expect(Rfc.parseOrNull('COSC8001137NA')).not.toBeNull();
        expect(Rfc.parseOrNull('')).toBeNull();
    });

    test('serial number', () => {
        const rfc = Rfc.fromSerial(1348025748541);
        expect(rfc.calculateSerial()).toBe(1348025748541);
        expect(rfc.getRfc()).toBe('DIM8701081LA');
    });

    test('create bad digit', () => {
        const rfc = Rfc.parse('COSC8001137N9');
        expect(rfc.calculateChecksum()).toBe('A');
        expect(rfc.doesCheckSumMatch()).toBeFalsy();
    });

    test('with multibyte', () => {
        const rfcMultibyte = 'AñÑ801231JK0';
        const expected = 'AÑÑ801231JK0';

        const rfc = Rfc.parse(rfcMultibyte);
        expect(rfc.getRfc()).toBe(expected);
    });

    test('json serializable', () => {
        const data = { rfc: Rfc.unparsed('COSC8001137NA') };
        expect(JSON.stringify(data)).toBe('{"rfc":"COSC8001137NA"}');
        expect(data.rfc.toJSON()).toBe('COSC8001137NA');
    });

    test('create generic', () => {
        const rfc = Rfc.newGeneric();
        expect(rfc.getRfc()).toBe(Rfc.RFC_GENERIC);
    });

    test('create foreign', () => {
        const rfc = Rfc.newForeign();
        expect(rfc.getRfc()).toBe(Rfc.RFC_FOREIGN);
    });
});
