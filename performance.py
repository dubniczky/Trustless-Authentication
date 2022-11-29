from Cryptodome.Random import get_random_bytes
from Cryptodome.Hash import SHA256
from Cryptodome.PublicKey import RSA
from Cryptodome.Cipher import PKCS1_OAEP

import base64



def gen_salt(size=18):
    return get_random_bytes(size)



def client_generate(pubsalt, pubkey, password):
    # salt
    salted = bytes(password, 'utf-8') + pubsalt
    # hash
    hash = SHA256.new()
    hash.update(salted)
    digest = hash.digest()
    # encrypt
    encryptor = PKCS1_OAEP.new(pubkey)
    encrypted = encryptor.encrypt(digest)
    # send
    return encrypted



def server_register(password):
    # generate context
    pubsalt = gen_salt(18)
    privsalt = gen_salt(18)    
    rsa = RSA.generate(1024)    
    # wait for client
    user_hash = client_generate(pubsalt, rsa.public_key(), password)
    # decrypt
    decryptor = PKCS1_OAEP.new(rsa)
    decrypted = decryptor.decrypt(user_hash)
    # hash
    hash = SHA256.new()
    hash.update(decrypted + privsalt)
    final = base64.b64encode(hash.digest())
    # store
    return (pubsalt, privsalt, final)



def server_login(user, password):
    # generate context
    pubsalt = user[0]
    privsalt = user[1]
    rsa = RSA.generate(2048)    
    # wait for client
    user_hash = client_generate(pubsalt, rsa.public_key(), password)
    # decrypt    
    decryptor = PKCS1_OAEP.new(rsa)
    decrypted = decryptor.decrypt(user_hash)
    # hash
    hash = SHA256.new()
    hash.update(decrypted + privsalt)
    final = base64.b64encode(hash.digest())
    # verify
    return user[2] == final



def run_full_test(num):
    for _ in range(num):
        passw = gen_salt(32)
        user = server_register(passw)
        if (not server_login(user, passw)):
            print("error")
            
            
            
def run_login_test(num):
    passw = gen_salt(32)
    user = server_register(passw)
    for _ in range(num):
        if (not server_login(user, passw)):
            print("error")
            
            

if (__name__ == '__main__'):
    import datetime
    
    test_count = 5
    
    def perf():
        return datetime.datetime.now()

    start_time = perf()
    run_full_test(test_count)
    end_time = perf()

    start_time = perf()
    run_login_test(test_count)
    end_time = perf()