import {Component, OnInit} from '@angular/core';
import {Community} from '../../../domain/community/community';
import {CommunityService} from '../../../domain/community/community.service';

@Component({
  selector: 'app-up-and-coming-communities',
  templateUrl: './up-and-coming-communities.component.html',
  styleUrls: ['./up-and-coming-communities.component.scss']
})
export class UpAndComingCommunitiesComponent implements OnInit {

  communities: Community[] = [];

  private communityService: CommunityService;

  constructor(communityService: CommunityService) {
    this.communityService = communityService;
  }

  ngOnInit(): void {
    this.communityService.fetchUpAndComing({size: '5'}).subscribe(communities => {
      this.communities = communities;
    });
  }

}
