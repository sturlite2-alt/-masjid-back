import { Request, Response, NextFunction } from 'express';
import { ContactInfoRepository } from '../repositories/ContactInfoRepository';

const contactRepository = new ContactInfoRepository();

export const getContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contact = await contactRepository.findCurrent();
    if (!contact) {
      // Default demo details
      res.json({
        phone: "+91 98765 43210",
        email: "info@masjidfirdouse.org",
        address: "Ali Nagar, Guntur, Andhra Pradesh, India",
        whatsapp: "919876543210",
        youtube: "https://youtube.com/@masjidfirdouse",
        facebook: "https://facebook.com/masjidfirdouse",
      });
      return;
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContactInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { phone, email, address, whatsapp, youtube, facebook } = req.body;
    // All fields are optional

    const updated = await contactRepository.updateCurrent({
      phone,
      email,
      address,
      whatsapp,
      youtube,
      facebook,
    });

    res.json({ message: 'Contact details updated successfully', contact: updated });
  } catch (error) {
    next(error);
  }
};
