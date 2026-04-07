import pandas as pd

class Data:

    def __init__(self, path):
        self.path = path

        _chunk_size = 1000 # private var to control chunk size
        _complete_chunks = [] # storing complete chunks
        

        # loop to read csv file in specified chunk size
        for chunk in pd.read_csv(self.path, chunksize=_chunk_size):
            complete_chunk = chunk.dropna(how="any") # drops any row from the chunk which has any empty column
            _complete_chunks.append(complete_chunk)
        
        if _complete_chunks:
            self.df = pd.concat(_complete_chunks, ignore_index=True) # creates df after the file has been checked to filter out rows with emtpy columns


    # update func can be called to update the db with live info when the server's running
    def update(self):
        # adds the newest line of the csv file to the dataframe
        with open(self.path, "r") as file:
            _new_row = None
            for row in file:
                _new_row = row.strip()
            
            # creating list from line to check for empty columns
            for col in _new_row.split(","):
                # ending func if empty col is found
                if col == "":
                    return
            self.df = pd.concat([self.df, pd.DataFrame(_new_row.split(","))], ignore_index=True)
            
            # returning the newest row for tracking purposes
            return _new_row.split(",")


    # head() and tail() for testing purposes
    def head(self):
        return self.df.head()

    def tail(self):
        return self.df.tail()