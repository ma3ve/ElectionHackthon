def test(**kwargs):
    print(kwargs)


a = {"a": 1, "b": 2, "c": 3}
b = {"a": 4, "b": 3, "c": 6}
b.update(a)
test(**a)
