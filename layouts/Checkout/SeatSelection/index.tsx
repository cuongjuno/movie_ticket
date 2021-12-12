import React, { useEffect, useState } from 'react';
import { Select, Table } from 'antd';
import LayoutSeat from '@/components/LayoutSeat';
import { InfoTicket } from '..';
import {
  IDataMovie,
  IDataCinemasByMovie,
  IDataScheduleByMovie,
  IDataGetSeats,
  ISeat,
} from '@/common/interface/movie.interface';
import { useRouter } from 'next/router';
import {
  getCinemasByMovie,
  getDatesByMovie,
  getSchedulesByMovie,
  getSeatsByRoom,
} from '@/services/movie.service';
import moment from 'moment';
import { groupBy } from 'lodash';

const { Option } = Select;

interface IProps {
  infoTicket: InfoTicket;
  setInfoTicket: React.Dispatch<React.SetStateAction<InfoTicket>>;
}

function SeatSelection(props: IProps) {
  const { infoTicket, setInfoTicket } = props;

  const router = useRouter();

  const idMovie = router.query.id;

  const [optionCinemas, setOptionCinemas] = useState([]);
  const [optionDates, setOptionDates] = useState<string[]>([]);
  const [optionTimes, setOptionTimes] = useState<IDataScheduleByMovie[]>([]);
  const [vipPrice, setVipPrice] = useState<number>(0);
  const [dataSeats, setDataSeats] = useState<{ [key: number]: ISeat[] }>();

  const dataSource = [
    {
      key: '1',
      location: 'A1, A3',
      price: '50000VNĐ',
      drink: 'Có',
      total: '150000VNĐ',
    },
  ];

  const columns = [
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Thêm bỏng + nước',
      dataIndex: 'drink',
      key: 'drink',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const listReserved = [
    'A1',
    'A2',
    'A3',
    'A4',
    'B4',
    'B5',
    'B6',
    'C8',
    'C9',
    'C10',
    'C11',
  ];

  const [listSelected, setListSelected] = useState<string[]>([]);

  const getDataCinemaByMovie = async (id: string) => {
    const res = await getCinemasByMovie(id);
    if (res?.foundItems) {
      setOptionCinemas(res?.foundItems);
    }
  };

  const getDataDateByCinemaAndMovie = async (
    cinema: string,
    id_movie: string
  ) => {
    const res = (await getDatesByMovie(id_movie, { cinemaId: cinema })) as {
      success: boolean;
      data: string[];
    };

    if (res?.success) {
      setOptionDates(res?.data);
    }
  };

  const getDataSchdulesByMovie = async (
    id_movie: string,
    cinemaId: string,
    date: string
  ) => {
    const res = (await getSchedulesByMovie(id_movie, { cinemaId, date })) as {
      foundItems: IDataScheduleByMovie[];
    };

    if (res?.foundItems) {
      setOptionTimes(res?.foundItems);
    }
  };

  const getDataSeatsByRoom = async (roomId: string) => {
    const res = (await getSeatsByRoom(roomId)) as IDataGetSeats;
    if (res?.seats) {
      const groupSeats = groupBy(res?.seats, 'row') as unknown as {
        [key: number]: ISeat[];
      };
      const listPrice = res?.seats?.map((seat) => seat?.ticketPrice);
      const maxPrice = Math.max(...listPrice);
      setVipPrice(maxPrice as number);
      setDataSeats(groupSeats);
      console.log('sea', res?.seats, groupSeats);
    }
  };

  const handleSelectCinema = (cinema: string) => {
    if (idMovie) {
      const tempInfo = { ...infoTicket, cinema };
      setInfoTicket(tempInfo);
      getDataDateByCinemaAndMovie(cinema, idMovie as string);
    }
  };

  const handleSelectDate = (date: string) => {
    if (idMovie && infoTicket?.cinema) {
      const tempInfo = { ...infoTicket, date };
      setInfoTicket(tempInfo);
      getDataSchdulesByMovie(idMovie as string, infoTicket?.cinema, date);
    }
  };

  const handleSelectTime = (roomId: string) => {
    if (idMovie && infoTicket?.cinema && infoTicket?.date) {
      const tempInfo = { ...infoTicket, roomId };
      setInfoTicket(tempInfo);
      getDataSeatsByRoom(roomId);
    }
  };

  useEffect(() => {
    if (idMovie) {
      getDataCinemaByMovie(idMovie as string);
    }
  }, [idMovie]);

  return (
    <div className="seat-selection">
      <div className="seat-selection-select-fields mb-64">
        <Select
          value={infoTicket?.cinema || undefined}
          style={{ width: '30%' }}
          placeholder="Chọn rạp..."
          onChange={(cinema: string) => handleSelectCinema(cinema)}
        >
          {optionCinemas?.map((cinema: IDataCinemasByMovie) => (
            <Option key={cinema?.id} value={cinema?.id}>
              {cinema?.name}
            </Option>
          ))}
        </Select>
        <Select
          value={infoTicket?.date || undefined}
          style={{ width: '30%' }}
          onChange={(date: string) => handleSelectDate(date)}
          placeholder="Chọn ngày..."
        >
          {optionDates.map((date) => (
            <Option value={date}>{moment(date).format('DD/MM/YYYY')}</Option>
          ))}
        </Select>
        <Select
          disabled={!(infoTicket?.cinema && infoTicket?.date)}
          value={infoTicket?.roomId || undefined}
          style={{ width: '30%' }}
          placeholder="Chọn suất chiếu..."
          onChange={(time: string) => handleSelectTime(time)}
        >
          {optionTimes.map((time) => (
            <Option value={time?.roomId}>
              {moment(time?.startTime).format('HH:mmA')}
            </Option>
          ))}
        </Select>
      </div>
      <div className="seat-selection-hr">
        <hr />
        <div className="div-center">
          <h1 className="mb-16 seat-selection-name-cinema">MÀN HÌNH</h1>
        </div>
      </div>
      {dataSeats && vipPrice && (
        <div className="seat-selection-layout-seat mb-64">
          <LayoutSeat
            dataSeats={dataSeats as { [key: number]: ISeat[] }}
            vipPrice={vipPrice}
            listSelected={listSelected}
            setListSelected={setListSelected}
          />
        </div>
      )}

      <div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
      <style jsx>{`
        .seat-selection {
          &-name-cinema {
            font-size: 2rem;
            font-weight: 300;
            z-index: 10;
          }
          &-select-fields {
            display: flex;
            width: 90%;
            justify-content: space-between;
          }
          &-hr {
            width: 100%;
            hr {
              height: 1px;
              background: #8a8686;
            }
          }
          &-layout-seat {
            width: 100%;
          }
        }

        // select

        div :global(.ant-select-selector) {
          background-color: transparent !important;
          border-color: #d9d9d9 !important;
          height: 40px !important;
          &:hover {
            border-color: white !important;
          }
        }
        div :global(.ant-select-arrow) {
          color: white !important;
        }

        div :global(.ant-select-selection-item) {
          color: white !important;
          padding-top: 4px !important;
        }

        div :global(.ant-select-selection-placeholder) {
          padding-top: 4px !important;
        }
      `}</style>
    </div>
  );
}

export default SeatSelection;
