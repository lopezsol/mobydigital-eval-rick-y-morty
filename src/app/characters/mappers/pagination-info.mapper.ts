import { RestPaginationInfo } from '../interfaces/paginated-characters.interface';
import { PaginationInfo } from '../interfaces/pagination-info.interface';

export class PaginationInfoMapper {
  static mapRestPaginationInfoToPaginationInfo(
    restPagination: RestPaginationInfo
  ): PaginationInfo {
    return {
      count: restPagination.count,
      pages: restPagination.pages,
      next: restPagination.next,
      prev: restPagination.prev,
    };
  }
}
