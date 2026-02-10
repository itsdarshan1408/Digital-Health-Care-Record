import express from 'express';
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/recordsController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

router.route('/')
  .get(protect, getRecords)
  .post(protect, upload.array('files', 5), createRecord);

router.route('/:id')
  .get(protect, getRecordById)
  .put(protect, updateRecord)
  .delete(protect, deleteRecord);

export default router;
