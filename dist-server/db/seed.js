export function seed(db) {
    const seedAll = db.transaction(() => {
        // Project
        const project = db.prepare(`
      INSERT INTO projects (name, site_code, address, status, progress_pct, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Applied Materials Israel', 'PDC05', 'Реховот, ул. Вейцмана 42', 'active', 68, '2024-11-01');
        const projectId = project.lastInsertRowid;
        // Floors
        const floorNames = [
            { name: 'Этаж 1', pct: 100, total: 12, done: 12 },
            { name: 'Этаж 2', pct: 95, total: 15, done: 14 },
            { name: 'Этаж 3', pct: 80, total: 18, done: 14 },
            { name: 'Этаж 4', pct: 72, total: 20, done: 14 },
            { name: 'Этаж 5', pct: 60, total: 16, done: 10 },
            { name: 'Этаж 6', pct: 45, total: 14, done: 6 },
            { name: 'Этаж 7', pct: 30, total: 12, done: 4 },
            { name: 'Этаж 8', pct: 10, total: 10, done: 1 },
            { name: 'Этаж 9', pct: 5, total: 8, done: 0 },
            { name: 'Этаж 10', pct: 0, total: 6, done: 0 },
        ];
        const insertFloor = db.prepare(`
      INSERT INTO floors (project_id, name, parts_delivered_pct, constructions_total, constructions_done)
      VALUES (?, ?, ?, ?, ?)
    `);
        const floorIds = [];
        for (const f of floorNames) {
            const res = insertFloor.run(projectId, f.name, f.pct, f.total, f.done);
            floorIds.push(res.lastInsertRowid);
        }
        // Constructions for Floor 3 (index 2) — detailed view
        const floor3Id = floorIds[2];
        const constructions = [
            { code: 'CP-1029', name: 'Copy Point 1029', status: 'done', parts_total: 8, parts_on_site: 8 },
            { code: 'WS-A12', name: 'Workstation A-12', status: 'delivery', parts_total: 12, parts_on_site: 9 },
            { code: 'WS-A13', name: 'Workstation A-13', status: 'shortage', parts_total: 12, parts_on_site: 7 },
            { code: 'ST-B04', name: 'Storage Unit B-04', status: 'ready', parts_total: 6, parts_on_site: 0 },
            { code: 'MT-C01', name: 'Meeting Table C-01', status: 'defect', parts_total: 10, parts_on_site: 10 },
            { code: 'RC-D02', name: 'Reception Desk D-02', status: 'ready', parts_total: 15, parts_on_site: 0 },
        ];
        const insertConstruction = db.prepare(`
      INSERT INTO constructions (floor_id, project_id, code, name, status, parts_total, parts_on_site)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        const constructionIds = [];
        for (const c of constructions) {
            const res = insertConstruction.run(floor3Id, projectId, c.code, c.name, c.status, c.parts_total, c.parts_on_site);
            constructionIds.push(res.lastInsertRowid);
        }
        // Parts for Workstation A-12 (index 1)
        const ws12Id = constructionIds[1];
        const parts = [
            { number: 1, name_he: 'לוח צד שמאל', name_ru: 'Боковая панель левая', dimensions: '720×18×580', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 2, name_he: 'לוח צד ימין', name_ru: 'Боковая панель правая', dimensions: '720×18×580', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 3, name_he: 'לוח עליון', name_ru: 'Верхняя панель', dimensions: '1200×25×600', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 4, name_he: 'מדף ביניים', name_ru: 'Средняя полка', dimensions: '1164×18×580', material: 'ЛДСП', color: 'Белый', status: 'transit' },
            { number: 5, name_he: 'גב', name_ru: 'Задняя стенка', dimensions: '1200×8×720', material: 'ДВП', color: 'Белый', status: 'transit' },
            { number: 6, name_he: 'דלת שמאל', name_ru: 'Дверь левая', dimensions: '716×18×396', material: 'ЛДСП', color: 'Серый', status: 'paint' },
            { number: 7, name_he: 'דלת ימין', name_ru: 'Дверь правая', dimensions: '716×18×396', material: 'ЛДСП', color: 'Серый', status: 'warehouse' },
            { number: 8, name_he: 'ידית', name_ru: 'Ручка', dimensions: '128×10×35', material: 'Металл', color: 'Хром', status: 'warehouse' },
            { number: 9, name_he: 'בסיס', name_ru: 'Основание', dimensions: '1200×100×600', material: 'МДФ', color: 'Белый', status: 'warehouse' },
            { number: 10, name_he: 'חוצץ', name_ru: 'Перегородка', dimensions: '564×18×680', material: 'ЛДСП', color: 'Белый', status: 'warehouse' },
            { number: 11, name_he: 'כיסוי אחורי', name_ru: 'Задняя заглушка', dimensions: '50×5×720', material: 'Пластик', color: 'Белый', status: 'warehouse' },
            { number: 12, name_he: 'פלינתוס', name_ru: 'Плинтус', dimensions: '1180×80×20', material: 'МДФ', color: 'Белый', status: 'warehouse' },
        ];
        const insertPart = db.prepare(`
      INSERT INTO parts (construction_id, number, name_he, name_ru, dimensions, material, color, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
        const partIds = [];
        for (const p of parts) {
            const res = insertPart.run(ws12Id, p.number, p.name_he, p.name_ru, p.dimensions, p.material, p.color, p.status);
            partIds.push(res.lastInsertRowid);
        }
        // Parts for Copy Point 1029 (index 0)
        const cp1029Id = constructionIds[0];
        const cpParts = [
            { number: 1, name_he: 'משטח עבודה', name_ru: 'Рабочая поверхность', dimensions: '900×25×600', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 2, name_he: 'לוח גב', name_ru: 'Задняя панель', dimensions: '900×8×500', material: 'ДВП', color: 'Белый', status: 'done' },
            { number: 3, name_he: 'צד שמאל', name_ru: 'Левая сторона', dimensions: '500×18×600', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 4, name_he: 'צד ימין', name_ru: 'Правая сторона', dimensions: '500×18×600', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 5, name_he: 'מדף עליון', name_ru: 'Верхняя полка', dimensions: '864×18×580', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 6, name_he: 'מגירה', name_ru: 'Ящик', dimensions: '400×200×500', material: 'ЛДСП', color: 'Белый', status: 'done' },
            { number: 7, name_he: 'ידית מגירה', name_ru: 'Ручка ящика', dimensions: '96×10×30', material: 'Металл', color: 'Черный', status: 'done' },
            { number: 8, name_he: 'רגל', name_ru: 'Ножка', dimensions: '50×50×720', material: 'Металл', color: 'Серебро', status: 'done' },
        ];
        for (const p of cpParts) {
            insertPart.run(cp1029Id, p.number, p.name_he, p.name_ru, p.dimensions, p.material, p.color, p.status);
        }
        // Scan history for part 4 (Средняя полка — transit)
        const midShelfId = partIds[3];
        const insertScan = db.prepare(`
      INSERT INTO scan_history (part_id, scanned_by, location, event, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
        insertScan.run(midShelfId, 'Даниил К.', 'Склад А', 'Принято на склад', '2024-11-10 08:30');
        insertScan.run(midShelfId, 'Сергей М.', 'Транспорт', 'Отгружено', '2024-11-12 14:00');
        insertScan.run(midShelfId, 'Водитель', 'Объект PDC05', 'Доставлено на объект', '2024-11-13 09:15');
        // Issue for part 6 (Дверь левая — paint)
        const doorLeftId = partIds[5];
        db.prepare(`
      INSERT INTO issues (part_id, construction_id, type, comment, urgency, reported_by, raw_input, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(doorLeftId, ws12Id, 'paint', 'Царапина на лицевой поверхности двери, требуется покраска', 'medium', 'Даниил К.', 'дверь поцарапана нужна покраска', '2024-11-13 10:00');
        // Add constructions for other floors too (minimal)
        for (let i = 0; i < floorIds.length; i++) {
            if (i === 2)
                continue; // already done
            const fid = floorIds[i];
            insertConstruction.run(fid, projectId, `WS-F${i + 1}-01`, `Workstation F${i + 1}-01`, 'ready', 8, 0);
            insertConstruction.run(fid, projectId, `ST-F${i + 1}-01`, `Storage F${i + 1}-01`, 'ready', 6, 0);
        }
    });
    seedAll();
}
