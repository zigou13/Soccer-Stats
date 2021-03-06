import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Scorer} from '../model/scorer';
import {Router} from '@angular/router';
import {MatchService} from '../services/match.service';
import {Match} from '../model/match';
import {TeamsService} from '../services/teams.service';
import {LeagueId} from '../model/league-id';
import {Result} from '../model/result';
import {LeagueService} from '../services/league.service';

@Component({
    selector: 'app-scorer-info',
    templateUrl: './scorer-info.component.html',
    styleUrls: ['./scorer-info.component.scss'],
})
export class ScorerInfoComponent implements OnInit {
    scorer: Scorer;
    lastFiveMatches: Match[];
    WIN = Result.WIN;
    LOSE = Result.LOSE;
    DRAW = Result.DRAW;

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private router: Router,
        private matchService: MatchService,
        private teamService: TeamsService
    ) {
        this.scorer = this.navParams.get('scorer');
    }

    ngOnInit() {
        this.getMatches();
    }

    closeModal() {
        this.modalCtrl.dismiss();
        this.router.navigate(['tabs/scorers']);
    }

    getMatches() {
        this.matchService.getMatches(this.scorer.team.id).subscribe((matches) => {
            this.lastFiveMatches = matches.matches.slice(0, 5);
            this.teamService.getTeams(LeagueService.league).subscribe((teams) => {
                this.lastFiveMatches.forEach(match => {
                    match.score.homeTeam = teams.teams.find(t => t.id === match.homeTeam.id);
                    match.score.awayTeam = teams.teams.find(t => t.id === match.awayTeam.id);
                });
            });
        });
    }

    doTeamWin(match: Match): number {
        return this.matchService.doTeamWin(match, this.scorer.team);
    }
}
