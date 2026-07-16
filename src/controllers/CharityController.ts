import { Request, Response, NextFunction } from 'express';
import { CharityRepository } from '../repositories/CharityRepository';

const charityRepository = new CharityRepository();

export const getCharityDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const charity = await charityRepository.findCurrent();
    if (!charity) {
      // Return a default schema response if none exists
      res.json({
        upiId: "masjidfirdouse@upi",
        accountName: "Masjid-E-Firdouse Trust",
        bankName: "State Bank of India",
        ifsc: "SBIN0001234",
        qrImage: "",
      });
      return;
    }
    res.json(charity);
  } catch (error) {
    next(error);
  }
};

export const updateCharityDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { upiId, accountName, bankName, ifsc } = req.body;
    let qrImage = req.body.qrImage;

    if (!upiId || !accountName || !bankName || !ifsc) {
      res.status(400).json({ message: 'UPI ID, Account Name, Bank Name, and IFSC are required' });
      return;
    }

    // If a file was uploaded, convert it to a base64 string
    if (req.file) {
      const mimeType = req.file.mimetype;
      const base64Data = req.file.buffer.toString('base64');
      qrImage = `data:${mimeType};base64,${base64Data}`;
    }

    const updated = await charityRepository.updateCurrent({
      upiId,
      accountName,
      bankName,
      ifsc,
      qrImage,
    });

    res.json({ message: 'Charity details updated successfully', charity: updated });
  } catch (error) {
    next(error);
  }
};
