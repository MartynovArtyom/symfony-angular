import { Component, OnInit } from '@angular/core';
import { AdminInterviewList } from '../../../../../entities/models-admin';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { AdminService } from '../../../../services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationService } from '../../../../services/pagination.service';

@Component({
  selector: 'app-admin-applicants-awaiting',
  templateUrl: './admin-applicants-awaiting.component.html',
  styleUrls: ['./admin-applicants-awaiting.component.scss']
})
export class AdminApplicantsAwaitingComponent implements OnInit {

  public applicantsAwaiting = Array<AdminInterviewList>();

  public preloaderPage = true;
  public totalCount: number;
  public selectedBusinessJobId: number;

  public paginationLoader = false;
  public pagination = 1;
  public loadMoreCheck = true;
  public modalActiveClose: any;
  public selectedBusinessJob;

  public orderBy: string = '';
  public orderSort: boolean;
  public paginationFilter = false;
  public search: string = '';

  public totalItems: number;
  public pager: any = {
    currentPage: 1
  };

  constructor(
    private readonly _adminService: AdminService,
    private readonly _sharedService: SharedService,
    private readonly _router: Router,
    private readonly _paginationService: PaginationService,
    private readonly _modalService: NgbModal
  ) {
    this._sharedService.checkSidebar = false;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.applicantsAwaiting = [];
    this.getApplicantsAwaiting(this.search).then(() => {
      this.pager = this._paginationService.getPager(this.totalItems, 1);
    });
  }

  /**
   * Set pagination page
   * @param {number} page
   */
  public setPage(page: number) {
    this.paginationLoader = true;
    this.applicantsAwaiting = [];
    this.pager = this._paginationService.getPager(this.totalItems, page);
    window.scrollTo(100, 0);

    this.getApplicantsAwaiting(this.search);
  }

  /**
   * Sort by table columns
   */
  public sortCandidate(column: string): void {
    this.resetArrayPagination();
    this.paginationFilter = true;

    this.orderBy = column;
    this.orderSort = !this.orderSort;

    this.getApplicantsAwaiting(this.search);
  }

  /**
   * Reset Array
   */
  public resetArrayPagination(): void{
    this.applicantsAwaiting = [];
    this.pager.currentPage = 1;
  }

  /**
   * Reset sorting
   */
  public resetSorting() {
    this.orderBy = null;
    this.orderSort = null;
  }

  /**
   * Router admin for candidate on id
   * @param id
   */
  public routeCandidate(id) {
    this._router.navigate(['/admin/edit_candidate'], { queryParams: { candidateId: id} });
  }

  /**
   * Managed modal
   * @param content {any} - content to be shown in popup
   * @param jobId {number} - job id to be used for fetching data and showing in popup
   * @param clientID {number} - job id to be used for fetching data and showing in popup
   * @param subcontent {any} - job id to be used for fetching data and showing in popup
   */
  public openVerticallyCenterJob(content: any, jobId, clientID, subcontent): void {
    if (jobId){
      this.selectedBusinessJob = {
        id: jobId
      };
      this.modalActiveClose = this._modalService.open(content, { centered: true, 'size': 'lg' });
    } else {
      this.selectedBusinessJobId = clientID;
      this.modalActiveClose = this._modalService.open(subcontent, { centered: true, 'size': 'lg' });
    }
  }

  /**
   * Get successfull placed interviews list
   * @return {Promise<void>}
   */
  public async getApplicantsAwaiting(search): Promise<void> {
    this.search = search;

    try {
      const response = await this._adminService.getApplicantsAwaiting(this.pager.currentPage, this.orderBy, this.orderSort, this.search);

      response.items.forEach((item) => {
        this.applicantsAwaiting.push(item);
      });

      this.totalItems = response.pagination.total_count;
      this.pager = this._paginationService.getPager(this.totalItems, this.pager.currentPage);

      if (response.pagination.total_count === this.applicantsAwaiting.length) {
        this.loadMoreCheck = false;
      } else if (response.pagination.total_count !== this.applicantsAwaiting.length){
        this.loadMoreCheck = true;
      }
      this.paginationLoader = false;

      this.totalCount = response.pagination.total_count;
      this.preloaderPage = false;
      this.paginationFilter = false;
    }
    catch (err) {
      this._sharedService.showRequestErrors(err);
    }
  }

  /**
   * Select change router
   * @param url
   */
  public routerApplicants(url): void {
    this._router.navigate([url]);
  }

  /**
   * Managed modal
   * @param content {any} - content to be shown in popup
   * @param jobId {number} - job id to be used for fetching data and showing in popup
   */
  public openVerticallyCentered(content: any,  jobId: number): void {
    this.selectedBusinessJobId = jobId;
    this.modalActiveClose = this._modalService.open(content, { centered: true, 'size': 'lg' });
  }

}
