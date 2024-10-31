
import { BadRequestException } from '@nestjs/common';

export function validateCustomUrl(customUrl?: string) {
    if (customUrl) {
        if (customUrl.length > 16) {
            throw new BadRequestException('Custom URL must not exceed 16 characters');
        }
        // Validasi karakter terlarang (hanya huruf, angka, dan tanda hubung)
        const invalidChars = /[^a-zA-Z0-9-]/; // Anda dapat menyesuaikan regex ini sesuai kebutuhan
        if (invalidChars.test(customUrl)) {
            throw new BadRequestException('Custom URL contains invalid characters');
        }
    }
}