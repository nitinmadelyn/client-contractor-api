import { Request, Response, NextFunction } from "express";
import { Profile } from "../models/model";
import { NotFoundError } from "../errors/NotFoundError";

interface ProfilePayload {
    id: string;
    firstName: string;
    lastName: string;
    profession: string;
    balance: number;
    type: string;
}

declare global {
    namespace Express {
        interface Request {
            profile?: ProfilePayload;
        }
    }
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    const profile = (await Profile.findOne({ where: { id: req.get('profile_id') || 0 } }))?.toJSON();
    if (!profile) {
        throw new NotFoundError('Profile not found.');
    }

    const { id, firstName, lastName, profession, balance, type } = profile;
    req.profile = { id, firstName, lastName, profession, balance, type };

    next();
}