import csv
import pandas as pd

PATH = "data-project-datasets-final/synthetic_outputs/livestock_tracking.csv"

class Data:

    def __init__(self, path):
        self.path = path

        _chunk_size = 1000 # private var to control chunk size
        _complete_chunks = [] # storing complete chunks

        # loop to read csv file in specified chunk size
        for chunk in pd.read_csv(self.PATH, chunksize=_chunk_size):
            complete_chunk = chunk.dropna(how="any") # drops any row from the chunk which has any empty column
            complete_chunk.append(complete_chunk)
        
        if _complete_chunks:
            self.df = pd.concat(_complete_chunks, ignore_index=True) # creates df after the file has been checked to filter out rows with emtpy columns


    # update func can be called to update the db with live info when the server's running
    def update(self):
        # adds the newest line of the csv file to the dataframe
        with open(self.path, 'r') as file:
            temp_df = pd.read_csv(self.path)
            temp_row = temp_df.iloc[-1]



    # head() and tail() for analysis purposes
    def head(self):
        return self.df.head()

    def tail(self):
        return self.df.tail()