import fs from 'fs';
import { ElevenLabsClient } from "elevenlabs";

async function main() {
    const elevenlabs = new ElevenLabsClient({
        apiKey: "YOUR_API_KEY"
    });

    // Step 1: Create a Pronunciation Dictionary
    const pronunciationFile = fs.createReadStream("/path/to/your/pronunciation-dictionary.xml");
    const dictionaryName = "TomatoPronunciation";

    const dictionaryResponse = await elevenlabs.pronunciationDictionary.createFromFile(
        pronunciationFile, 
        {
            name: dictionaryName,
            description: "Pronunciation dictionary for tomato variations."
        }
    );
    console.log("Pronunciation dictionary created:", dictionaryResponse);

    // Step 2: Generate Audio for 'Tomato' with Pronunciation Dictionary
    const audioResponse = await elevenlabs.textToSpeech.convert(
        dictionaryResponse.id,
        {
            text: "tomato",
            output_format: "mp3_44100_128",
            voice_id: "Rachel",
            pronunciation_dictionary_locators: [{
                pronunciation_dictionary_id: dictionaryResponse.id,
                version_id: dictionaryResponse.version_id
            }]
        }
    );

    await play(audioResponse);

    // Step 3: Remove Tomato Rules from Pronunciation Dictionary
    await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(
        dictionaryResponse.id,
        {
            rule_strings: ["tomato", "Tomato"]
        }
    );
    console.log("Tomato rules removed from dictionary:", dictionaryResponse.id);

    // Step 4: Generate Audio for 'Tomato' without Pronunciation Dictionary
    const audioResponseWithoutDict = await elevenlabs.textToSpeech.convert(
        'Rachel',
        {
            text: "tomato",
            output_format: "mp3_44100_128"
        }
    );

    await play(audioResponseWithoutDict);

    // Step 5: Add Tomato Rules to Dictionary Using Phonemes
    await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(
        dictionaryResponse.id,
        {
            rules: [{
                string_to_replace: "tomato",
                type: "phoneme",
                phoneme: "təˈmɑːtoʊ",
                alphabet: "IPA"
            }]
        }
    );
    console.log("Tomato phoneme rules added to dictionary:", dictionaryResponse.id);

    // Step 6: Generate Audio for 'Tomato' with New Phoneme Rules
    const audioResponseWithNewPhonemes = await elevenlabs.textToSpeech.convert(
        'Rachel',
        {
            text: "tomato",
            output_format: "mp3_44100_128",
            pronunciation_dictionary_locators: [{
                pronunciation_dictionary_id: dictionaryResponse.id,
                version_id: dictionaryResponse.version_id
            }]
        }
    );

    await play(audioResponseWithNewPhonemes);
}

// Helper function to play audio
async function play(audioResponse: any) {
    // This function would handle the playback of the audio response
    // For example, write the audio data to a file or stream it directly
    console.log("Playing audio...");
}

main().catch(console.error);
