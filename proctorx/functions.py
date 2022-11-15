from .models import Session
import datetime

def obtain_exam_schedules(date_input, time_input, length):
    suggestions=[]
    # Create date object
    date_split = date_input.split("-")
    year = int(date_split[0])
    month = int(date_split[1])
    day = int(date_split[2])
    time_split = time_input.split(":")
    hour = int(time_split[0])
    minute = int(time_split[1])

    if(minute > 30):
        # round up first suggestion to the next hour
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 0, 0))
     

    elif(minute < 30):
        #round up first suggestion to the current hour
        suggestions.append(datetime.datetime(year, month, day, hour, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))

    else:
        # keep the 30 minutes
        suggestions.append(datetime.datetime(year, month, day, hour, minute, 0))
        suggestions.append(datetime.datetime(year, month, day, hour + 1, 0, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 30, 0))
        suggestions.append(datetime.datetime(year, month, day, hour - 1, 0, 0))


    return suggestions
