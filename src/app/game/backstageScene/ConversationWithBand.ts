import { Conversation, IConversationScript } from '../../engine/models/Conversation';
import { ConversationLine } from '../../engine/models/ConversationLine';
import { Player } from '../../engine/models/Player';
import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { BandInSofa } from './BandInSofa';

const script: IConversationScript = {
    'initial': [
        new ConversationLine('READY_TO_PLAY', 'LIST_OF_PROBLEMS', sayProblemsIntro),
        new ConversationLine('HAVE_YOU_SEEN_BILI', 'initial', sayBiliSituation),
        new ConversationLine('TALK_TO_YOU_LATER', 'end')
    ],
    'LIST_OF_PROBLEMS': [
        new ConversationLine('PROBLEMS_LET_ME_HELP',
                             'INITIAL_AFTER_FIRST_TALK', sayListOfProblems),
        new ConversationLine('PROBLEMS_I_AM_OUT',
                             'INITIAL_AFTER_FIRST_TALK', sayListOfProblems)
    ],
    'INITIAL_AFTER_FIRST_TALK': [
        new ConversationLine('HOW_IS_BILI_DOING', 'INITIAL_AFTER_FIRST_TALK', sayBiliSituation),
        new ConversationLine('LETS_FIX_THIS_MESS', 'end')
    ],
    'WE_ARE_READY': [
        new ConversationLine('ALL_READY_FIND_BILI', 'end')
    ]
};

export class ConversationWithBand extends Conversation {


    constructor(protected player: DoctortillaPlayer, protected otherPerson: Thing) {
        super(player, otherPerson);
    }

    protected initState(): void {
        if (this.player.getAttr('TALKED_TO_BAND_ABOUT_PROBLEMS')) {
            this.state = this.getStateIfPlayerDeliveredEverything();
        } else {
            this.state = 'initial';
        }
    }

    protected loadScript(): void {
        this.script = Object.assign({}, script);
        let dialogPart: Array<ConversationLine> = [];
        dialogPart = this.script['INITIAL_AFTER_FIRST_TALK'].concat(dialogPart);

        this.loadExtraOptionsInInitialFirstTalk(dialogPart);
        this.script['INITIAL_AFTER_FIRST_TALK'] = dialogPart;
    }

    private loadExtraOptionsInInitialFirstTalk(dialogPart: Array<ConversationLine>) {
        this.addCostumeLine(dialogPart);
        this.addCableLine(dialogPart);
        this.addDrinkLine(dialogPart);
    }

    private addCostumeLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasCompleteCostume()) {
            dialogPart.unshift(new ConversationLine(
                'GOT_THE_COSTUME',
                'INITIAL_AFTER_FIRST_TALK',
                sayCostumeIsOk
            ));
        } else if(!this.player.getAttr('DELIVERED_COSTUME')) {
            dialogPart.unshift(new ConversationLine(
                'WHY_COSTUMES',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayWhyCostumes
            ));
            dialogPart.unshift(new ConversationLine(
                'ASK_ABOUT_COSTUME',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                talkAboutCostume
            ));
        }
    }

    private addCableLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasCable()) {
            dialogPart.unshift(new ConversationLine(
                'FOUND_THE_CABLE',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayCableIsOk
            ));
        }
    }

    private addDrinkLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasFunnyDrink()) {
            dialogPart.unshift(new ConversationLine(
                'HAVE_A_DRINK_SANTI',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayDrinkIsOk
            ));
        }
    }

    private getStateIfPlayerDeliveredEverything(): string {
        if (this.player.deliveredEverything()) {
            return 'WE_ARE_READY';
        } else {
            return 'INITIAL_AFTER_FIRST_TALK';
        }
    }

}

function sayProblemsIntro(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('THERE_ARE_SOME_PROBLEMS_1', 'angel')
                .then(() => {
                    return band.say('THERE_ARE_SOME_PROBLEMS_2', 'santi');
                })
                .then(() => {
                    return band.say('THERE_ARE_SOME_PROBLEMS_3', 'juan');
                });
}

function sayListOfProblems(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('WE_HAVE_THREE_PROBLEMS', 'angel')
                .then(() => {
                    return band.say('FIRST_ANGEL_CABLE', 'juan');
                })
                .then(() => {
                    return band.say('SECOND_JUAN_COSTUME', 'angel');
                })
                .then(() => {
                    return band.say('THIRD_SANTI_SHY', 'juan');
                });
}

function sayBiliSituation(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('HE_IS_OUT_SMOKING', 'angel');
}

function sayCostumeIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('THAT_IS_A_STUPID_COSTUME', 'juan')
                .then(() => {
                    return band.say('MINE_WAS_WAY_BETTER', 'juan');
                })
                .then(() => {
                    return player.say('YOU_BETTER_PUT_IT_ON');
                })
                .then(() => {
                    band.changeAttr('HAS_COSTUME', true);
                    player.changeAttr('DELIVERED_COSTUME', true);
                    player.removeCostume();
                    return player.say('OK_I_LL_PUT_IT_ON');
                });
}

function talkAboutCostume(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('WELL_I_HAD_AN_AWESOME_COSTUME', 'juan')
                .then(() => {
                    return band.say('IT_WAS_COWBOY_COSTUME', 'juan');
                })
                .then(() => {
                    return band.say('VINTAGE_PREMIUM_COSTUME', 'juan');
                })
                .then(() => {
                    return band.say('SO_PLEASE_FIND_ME_SOMETHING_ELEGANT_I_CAN_USE', 'juan');
                })
                .then(() => {
                    return player.say('SURE_BOSS');
                });
}

function sayWhyCostumes(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('MAN_YOU_SHOULD_KNOW_THIS', 'santi')
                .then(() => {
                    return band.say('IT_IS_A_LONG_TIME_TRADITION_THAT_WE_ALL_DRESSED_UP', 'juan');
                })
                .then(() => {
                    return band.say('SO_WE_SOMEHOW_DISTRACT_THE_ATTENTION', 'angel');
                });
}

function sayCableIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('I_AM_NOT_GOING_TO_ASK_WHERE_THIS_COMES_FROM', 'angel')
                .then(() => {
                    return band.say('YOU_STOLE_IT', 'santi');
                })
                .then(() => {
                    band.changeAttr('HAS_CABLE', true);
                    player.changeAttr('DELIVERED_CABLE', true);
                    player.removeCable();
                    return player.say('LET_S_SAY_I_HAVE_MY_SOURCES');
                });
}

function sayDrinkIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('MMM_A_REFRESHING_BEVERAGE', 'santi')
                .then(() => {
                    return band.say('GULP_GULP_GULP', 'santi');
                })
                .then(() => {
                    return player.wait(2000);
                })
                .then(() => {
                    return band.say('BURP', 'santi');
                })
                .then(() => {
                    return band.say('BARELY_TASTED_LIKE_DRUG', 'santi');
                })
                .then(() => {
                    return player.wait(2000);
                })
                .then(() => {
                    return band.say('I_AM_STATRING_TO_FEEL_READY_TO_PLAY', 'santi');
                })
                .then(() => {
                    band.changeAttr('HAS_DRINK', true);
                    player.changeAttr('DELIVERED_DRINK', true);
                    player.removeGlass();
                    return player.say('THAT_S_THE_SPIRIT');
                });
}
