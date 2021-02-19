import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import { TTSService } from './tts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tts')
@Controller('tts')
export class TTSController {
    constructor(private readonly ttsService: TTSService) {}

    @ApiOperation({ summary: 'Get audio file mp3'})
    @Get(':text')
    async create(@Param('text') text: string, @Req() request, @Res() response) {
        try {
            await this.ttsService.saveAudio(text, request, response);
        } catch (error) {
            console.log(error.message)
            return response.status(500).json(`Failed: ${error.message}`);
        }
    }
}
