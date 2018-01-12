import argparse
import csv
import hashlib
import base64
import sqlite3

import os


class Pixel:
    def __init__(self, timestamp, user, x, y, color):
        self.timestamp = timestamp
        self.user = user
        self.x = x
        self.y = y
        self.color = color

    def __repr__(self):
        return f'<Pixel [{self.user}, {self.x}, {self.y}, {self.color}]>'


def create_final_placements():
    """
    Creates a csv file with final placements.
    The board is supposed to be 1000x1000 pixel 0-999
    However the data set contains 1000 so we should ignore those here.
    """
    board = [[None] * 1000 for i in range(1000)]

    with open('../data/tile_placements.csv', 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        i = 0
        for timestamp, user_hash, x, y, color in reader:
            # if i > 100:
            #     break
            # i += 1
            x = int(x)
            y = int(y)
            timestamp = int(timestamp)
            if x == 1000 or y == 1000:
                continue
            if not board[y][x] or board[y][x].timestamp < timestamp:
                board[y][x] = Pixel(timestamp, user_hash, x, y, color)

    with open('../data/tile_placements_final.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for row in board:
            for pixel in row:
                if pixel:
                    writer.writerow([pixel.timestamp, pixel.user, pixel.x, pixel.y, pixel.color])

    print('last:', board[999][999])


def extract_usernames():
    """Return a list of iter of usernames"""
    o_fname = 'usernames.csv'
    with open(os.path.join('../data', o_fname), 'w') as out_file:
        out_writer = csv.writer(out_file)
        conn = sqlite3.connect('../data/place.sqlite')
        for user in conn.execute('SELECT author FROM placements group by author'):
            yield user[0]
        conn.close()


def generate_hash_to_user_file():
    """
    Generates a list of tuples in the format (hash, username) and saves them to csv file
    """
    with open('../data/hash_to_username.csv', 'w', newline='') as fh:
        writer = csv.writer(fh)
        for user in extract_usernames():
            writer.writerow([encode_username(user), user])


def load_user_hashes():
    d = {}
    with open('../data/hash_to_username.csv', 'r') as fh:
        reader = csv.reader(fh)
        for user_hash, username in reader:
            d[user_hash] = username
    return d


def tile_placements_unhashed(user_hashes):
    """
    Generates tile placements file with usernames instead of hashes.
    Leaves hash in if username is not in user_hashes.
    :param user_hashes: a map of user_hash -> username
    :return:
    """
    with open('../data/tile_placements_unhashed.csv', 'w', newline='') as fh_out:
        writer = csv.writer(fh_out)
        with open('../data/tile_placements_final.csv', 'r') as fh_in:
            reader = csv.reader(fh_in)
            for line in reader:
                if line[1] in user_hashes:
                    line[1] = user_hashes[line[1]]
                writer.writerow(line)


def encode_username(username):
    """encoded user name to match how reddit stores them b64(sha1)"""
    username_hash = hashlib.sha1(username.encode('utf-8'))
    return base64.b64encode(username_hash.digest()).decode('utf-8')


if __name__ == '__main__':
    print('Data Formatter')
    user_hash_map = load_user_hashes()
    tile_placements_unhashed(user_hash_map)
