from faker import Faker
import numpy as np
import os

abspath = os.path.abspath(__file__)
os.chdir(os.path.dirname(abspath))

fake = Faker(['it_IT', 'en_US', 'ja_JP'])
names = []
income = []

with open("data.txt", "w+", encoding='utf-8') as f:
    cont = 0
    f.write("<tr>\n")
    for _ in range(2000):
        name = fake.name()
        salary = np.random.uniform(0, 1000, 1)[0]
        if np.random.uniform(0, 1, 1)[0] > 0.2:
            salary = np.random.normal(3000, 300, size=1)[0]    

    
        
        f.write(f"    <td>{name}</td>\n")
        f.write(f"    <td>{salary:.2f}</td>\n")
        cont += 1
        if cont % 4 == 0:
            f.write("</tr>\n")
            f.write("<tr>\n")
            cont = 0
    f.write("</tr>\n")

