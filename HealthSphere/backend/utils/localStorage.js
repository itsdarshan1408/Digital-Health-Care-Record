import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty data files if they don't exist
const initializeDataFiles = () => {
  const files = {
    'users.json': [],
    'healthRecords.json': [],
    'fitnessEntries.json': [],
    'dietPlans.json': [],
    'messages.json': [],
    'posts.json': [],
    'challenges.json': [],
    'reminders.json': [],
    'subscriptions.json': [],
    'payments.json': [],
    'receipts.json': [],
    'usageTracking.json': [],
  };

  Object.entries(files).forEach(([filename, defaultData]) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  });
};

initializeDataFiles();

// Generic CRUD operations
class LocalStorage {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
  }

  // Read all data
  readAll() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Write all data
  writeAll(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Find all
  find(query = {}) {
    const data = this.readAll();
    if (Object.keys(query).length === 0) return data;

    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        if (key.includes('.')) {
          // Handle nested properties (e.g., 'schedule.time')
          const keys = key.split('.');
          let itemValue = item;
          for (const k of keys) {
            itemValue = itemValue?.[k];
          }
          return itemValue === value;
        }
        return item[key] === value;
      });
    });
  }

  // Find one
  findOne(query) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  // Find by ID
  findById(id) {
    return this.findOne({ _id: id });
  }

  // Create
  create(data) {
    const allData = this.readAll();
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allData.push(newItem);
    this.writeAll(allData);
    return newItem;
  }

  // Update by ID
  findByIdAndUpdate(id, updateData) {
    const allData = this.readAll();
    const index = allData.findIndex(item => item._id === id);
    
    if (index === -1) return null;

    allData[index] = {
      ...allData[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    this.writeAll(allData);
    return allData[index];
  }

  // Delete by ID
  findByIdAndDelete(id) {
    const allData = this.readAll();
    const index = allData.findIndex(item => item._id === id);
    
    if (index === -1) return null;

    const deleted = allData.splice(index, 1)[0];
    this.writeAll(allData);
    return deleted;
  }

  // Delete many
  deleteMany(query) {
    const allData = this.readAll();
    const filtered = allData.filter(item => {
      return !Object.entries(query).every(([key, value]) => item[key] === value);
    });
    this.writeAll(filtered);
    return { deletedCount: allData.length - filtered.length };
  }

  // Count documents
  countDocuments(query = {}) {
    return this.find(query).length;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Aggregate (simplified)
  aggregate(pipeline) {
    // Basic implementation for common aggregations
    let data = this.readAll();
    
    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(item => {
          return Object.entries(stage.$match).every(([key, value]) => {
            if (key === 'userId') return item.userId === value;
            return item[key] === value;
          });
        });
      }
      
      if (stage.$sort) {
        const sortKey = Object.keys(stage.$sort)[0];
        const sortOrder = stage.$sort[sortKey];
        data.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
      }
      
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
    }
    
    return data;
  }
}

// Export model creators
export const createModel = (collectionName) => {
  return new LocalStorage(collectionName);
};

export default LocalStorage;
