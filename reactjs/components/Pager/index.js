import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';

const Pager = ({ currentPage, limit, itemsTotal }, context) => {
  // Total amount of pages.
  const totalPages = Math.ceil(itemsTotal / limit) - 1;

  // Don't display pager if there are no available pages.
  if (totalPages <= 0) {
    return null;
  }

  // Amount of pages to display around the current page, excluding
  // the current page.
  let pagesToDisplay = 4;

  let pagerStart;
  let pagerEnd;

  const pagerShift = Math.trunc(pagesToDisplay / 2);

  for (let i = pagerShift; i >= 0; i--) {
    if (typeof pagerStart === 'undefined' && currentPage - i >= 0) {
      pagerStart = currentPage - i;
      pagesToDisplay -= i;
    }

    if (typeof pagerEnd === 'undefined' && currentPage + i <= totalPages) {
      pagerEnd = currentPage + i;
      pagesToDisplay -= i;
    }
  }

  if (pagesToDisplay > 0) {
    if (pagerStart > 0) {
      for (let i = pagesToDisplay; i > 0; i--) {
        if (pagerStart - i >= 0) {
          pagerStart -= i;
          break;
        }
      }
    }

    if (pagerEnd < totalPages) {
      for (let i = pagesToDisplay; i > 0; i--) {
        if (pagerEnd + i <= totalPages) {
          pagerEnd += i;
          break;
        }
      }
    }
  }

  const pager = [];
  for (let i = pagerStart; i <= pagerEnd; i++) {
    pager.push(i);
  }

  return (
    <div className="wrapper100percent">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 pagination">
            { totalPages > pagerEnd &&
            <Link route={`${context.pathname}?page=${totalPages}`}>
              <a>Last</a>
            </Link>
            }
            { currentPage + 1 <= totalPages &&
            <Link route={`${context.pathname}?page=${currentPage + 1}`}>
              <a>Next</a>
            </Link>
            }
            { pager.reverse().map(page => (
              page !== currentPage ?
                <Link route={`${context.pathname}?page=${page}`} key={page}>
                  <a>{page + 1}</a>
                </Link>
                :
                <span className="active" key={page}>{page + 1}</span>
            ))}
            { currentPage - 1 >= 0 &&
            <Link route={`${context.pathname}?page=${currentPage - 1}`}>
              <a>Prev</a>
            </Link>
            }

            { pagerStart > 0 &&
            <Link route={`${context.pathname}?page=0`}>
              <a>First</a>
            </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

Pager.propTypes = {
  currentPage: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  itemsTotal: PropTypes.number.isRequired,
};

Pager.contextTypes = {
  pathname: PropTypes.string,
};

export default Pager;
