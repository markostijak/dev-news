import {Component, Input, OnInit} from '@angular/core';
import {Community} from '../../../models/community';
import {CommunityService} from '../../../services/community/community.service';
import {AuthorizationService} from '../../../services/authorization/authorization.service';

@Component({
  selector: 'app-trending-communities',
  templateUrl: './trending-communities.component.html',
  styleUrls: ['./trending-communities.component.scss']
})
export class TrendingCommunitiesComponent implements OnInit {

  @Input()
  public communities: Community[] = [];

  private _communityService: CommunityService;
  private _authorizationService: AuthorizationService;

  constructor(communityService: CommunityService, authorizationService: AuthorizationService) {
    this._communityService = communityService;
    this._authorizationService = authorizationService;
  }

  public ngOnInit(): void {
  }

  public join(community: Community): void {
    this._communityService.join(community).subscribe(() => {
      community.membersCount++;
    });
  }

  public leave(community: Community): void {
    this._communityService.leave(community).subscribe(() => {
      community.membersCount--;
    });
  }

  get authorizationService(): AuthorizationService {
    return this._authorizationService;
  }

  get communityService(): CommunityService {
    return this._communityService;
  }

}
