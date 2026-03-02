const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 确保数据目录存在
const DATA_DIR = path.join(__dirname, '../game-data');
console.log('Data directory:', DATA_DIR);
if (!fs.existsSync(DATA_DIR)) {
    console.log('Creating data directory:', DATA_DIR);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Data directory created successfully');
} else {
    console.log('Data directory already exists');
}

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../')));

// 获取所有存档列表（最多5个）
app.get('/api/saves', (req, res) => {
    try {
        const saveSlots = [];
        for (let i = 1; i <= 5; i++) {
            const filePath = path.join(DATA_DIR, `save-${i}.json`);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                saveSlots.push({
                    id: i,
                    name: `存档 ${i}`,
                    timestamp: stats.mtime.getTime(),
                    gameState: data
                });
            } else {
                saveSlots.push({
                    id: i,
                    name: `存档 ${i}`,
                    timestamp: null,
                    gameState: null
                });
            }
        }
        res.json(saveSlots);
    } catch (error) {
        console.error('Error reading saves:', error);
        res.status(500).json({ error: 'Failed to read saves' });
    }
});

// 获取指定存档的游戏数据
app.get('/api/saves/:id', (req, res) => {
    try {
        const { id } = req.params;
        const slotId = parseInt(id);
        if (slotId < 1 || slotId > 5) {
            return res.status(400).json({ error: 'Invalid slot ID' });
        }
        
        const filePath = path.join(DATA_DIR, `save-${slotId}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 返回初始游戏状态，而不是404错误
            res.json({
                gold: 2000,
                stamina: 100,
                maxStamina: 100,
                lastStaminaUpdate: Date.now(),
                inventory: [
                    {
                        id: 'starter',
                        pokedexId: 4,
                        name: '小火龙',
                        types: ['Fire'],
                        rarity: 'Common',
                        stars: 1,
                        baseHp: 39,
                        baseAtk: 52,
                        baseDef: 43,
                        level: 1,
                        exp: 0,
                        equipment: {}
                    }
                ],
                teamIds: ['starter'],
                savedTeamIds: ['starter'],
                equipmentInventory: [],
                unlockedStages: 1,
                pokedexStatus: [],
                equipmentStatus: [],
                achievements: []
            });
        }
    } catch (error) {
        console.error('Error reading save:', error);
        res.status(500).json({ error: 'Failed to read save' });
    }
});

// 保存到指定存档
app.post('/api/saves/:id', (req, res) => {
    try {
        const { id } = req.params;
        const slotId = parseInt(id);
        if (slotId < 1 || slotId > 5) {
            return res.status(400).json({ error: 'Invalid slot ID' });
        }
        
        const filePath = path.join(DATA_DIR, `save-${slotId}.json`);
        const data = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
        
        console.log(`✅ 存档 ${slotId} 保存成功:`, new Date().toISOString());
        res.json({ success: true, message: 'Save created successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ error: 'Failed to save game data' });
    }
});

// 删除指定存档
app.delete('/api/saves/:id', (req, res) => {
    try {
        const { id } = req.params;
        const slotId = parseInt(id);
        if (slotId < 1 || slotId > 5) {
            return res.status(400).json({ error: 'Invalid slot ID' });
        }
        
        const filePath = path.join(DATA_DIR, `save-${slotId}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✅ 存档 ${slotId} 删除成功:`, new Date().toISOString());
            res.json({ success: true, message: 'Save deleted successfully' });
        } else {
            res.status(404).json({ error: 'Save not found' });
        }
    } catch (error) {
        console.error('Error deleting save:', error);
        res.status(500).json({ error: 'Failed to delete save' });
    }
});

// 获取指定存档的游戏数据（新路由，兼容 App.tsx 的请求格式）
app.get('/api/game-data/:saveSlot', (req, res) => {
    try {
        const { saveSlot } = req.params;
        const slotId = parseInt(saveSlot);
        
        // 如果 saveSlot 是 'default' 或无效，使用默认存档1
        if (isNaN(slotId) || slotId < 1 || slotId > 5) {
            const filePath = path.join(DATA_DIR, 'save-1.json');
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                res.json(JSON.parse(data));
            } else {
                // 返回初始状态
                res.json({
                    gold: 2000,
                    stamina: 100,
                    maxStamina: 100,
                    lastStaminaUpdate: Date.now(),
                    inventory: [
                        {
                            id: 'starter',
                            pokedexId: 4,
                            name: '小火龙',
                            types: ['Fire'],
                            rarity: 'Common',
                            stars: 1,
                            baseHp: 39,
                            baseAtk: 52,
                            baseDef: 43,
                            level: 1,
                            exp: 0,
                            equipment: {}
                        }
                    ],
                    teamIds: ['starter'],
                    savedTeamIds: ['starter'],
                    equipmentInventory: [],
                    unlockedStages: 1
                });
            }
            return;
        }
        
        const filePath = path.join(DATA_DIR, `save-${slotId}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 返回初始状态
            res.json({
                gold: 2000,
                stamina: 100,
                maxStamina: 100,
                lastStaminaUpdate: Date.now(),
                inventory: [
                    {
                        id: 'starter',
                        pokedexId: 4,
                        name: '小火龙',
                        types: ['Fire'],
                        rarity: 'Common',
                        stars: 1,
                        baseHp: 39,
                        baseAtk: 52,
                        baseDef: 43,
                        level: 1,
                        exp: 0,
                        equipment: {}
                    }
                ],
                teamIds: ['starter'],
                savedTeamIds: ['starter'],
                equipmentInventory: [],
                unlockedStages: 1
            });
        }
    } catch (error) {
        console.error('Error reading game data by slot:', error);
        res.status(500).json({ error: 'Failed to read game data' });
    }
});

// 保存游戏数据到指定存档（新路由，兼容 App.tsx 的请求格式）
app.post('/api/game-data/:saveSlot', (req, res) => {
    try {
        const { saveSlot } = req.params;
        const slotId = parseInt(saveSlot);
        
        // 如果 saveSlot 是 'default' 或无效，使用默认存档1
        let filePath;
        if (isNaN(slotId) || slotId < 1 || slotId > 5) {
            filePath = path.join(DATA_DIR, 'save-1.json');
        } else {
            filePath = path.join(DATA_DIR, `save-${slotId}.json`);
        }
        
        const data = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
        
        console.log(`✅ 游戏数据保存到存档 ${isNaN(slotId) ? '1' : slotId} 成功:`, new Date().toISOString());
        res.json({ success: true, message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data by slot:', error);
        res.status(500).json({ error: 'Failed to save game data' });
    }
});

// 获取当前游戏数据（用于自动保存，使用默认存档1）
app.get('/api/game-data', (req, res) => {
    try {
        const filePath = path.join(DATA_DIR, 'save-1.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // 返回初始状态
            res.json({
                gold: 2000,
                stamina: 100,
                maxStamina: 100,
                lastStaminaUpdate: Date.now(),
                inventory: [
                    {
                        id: 'starter',
                        pokedexId: 4,
                        name: '小火龙',
                        types: ['Fire'],
                        rarity: 'Common',
                        stars: 1,
                        baseHp: 39,
                        baseAtk: 52,
                        baseDef: 43,
                        level: 1,
                        equipment: {}
                    }
                ],
                teamIds: ['starter'],
                savedTeamIds: ['starter'],
                equipmentInventory: [],
                unlockedStages: 1
            });
        }
    } catch (error) {
        console.error('Error reading game data:', error);
        res.status(500).json({ error: 'Failed to read game data' });
    }
});

// 自动保存游戏数据（使用默认存档1）
app.post('/api/game-data', (req, res) => {
    try {
        const filePath = path.join(DATA_DIR, 'save-1.json');
        const data = JSON.stringify(req.body, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
        res.json({ success: true, message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ error: 'Failed to save game data' });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pokemaster Server running on http://localhost:${PORT}`);
    console.log(`Game data will be stored in: ${DATA_DIR}`);
});